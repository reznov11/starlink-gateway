import logging
from typing import Any
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission

from apps.domains.models import Domain
from apps.domains.models.domain import DomainStatus
from core.exceptions import CustomNotFound, CustomBadRequest, CustomNotAuthorized


class BaseOwner(BasePermission):
    def has_object_permission(self, request: HttpRequest, view: APIView, obj: Any) -> bool:
        return all(
            [
                request.user.is_authenticated,
                request.user.is_staff,
                obj.user == request.user
            ]
        )


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view: APIView) -> bool:
        return request.user.is_super_admin


class IsAdmin(BasePermission):
    def has_permission(self, request: HttpRequest, view: APIView) -> bool:
        return request.user.is_admin


class IsEmployee(BasePermission):
    def has_permission(self, request: HttpRequest, view: APIView) -> bool:
        return request.user.is_employee


class IsActiveUser(BasePermission):
    def has_permission(self, request: HttpRequest, view: APIView) -> bool:
        return all([
            request.user.is_active,
            request.user.is_staff,
        ])


class AccessFileBase(BasePermission):
    def has_permission(self, request: HttpRequest, view: APIView) -> bool:
        if request.user and request.user.is_authenticated:
            return True

        return False


class TrustedDomain:
    _logger = logging.getLogger(__name__)

    def has_permission(self, request: HttpRequest, view: APIView) -> bool:
        domain_code = request.GET.get("ifr_code", "").strip()

        if not domain_code:
            raise CustomBadRequest("Код домена не передан")

        domain = self._get_valid_domain(domain_code)

        if not domain or not domain.partner:
            raise CustomNotAuthorized("Несанкционированный доступ")

        if self._is_blocked_access(domain=domain, request=request):
            self._logger.warning(
                f"Доступ запрещен: Домен {domain.code}, URL: {self._get_request_host(request)}"
            )
            raise CustomNotAuthorized("Несанкционированный доступ")

        request.domain = domain
        return True

    @staticmethod
    def _get_request_host(request: HttpRequest) -> str:
        return request.headers.get("X-Partner-Url") or request.get_host()

    @staticmethod
    def _get_valid_domain(domain_code: str) -> Domain:
        domain = (
            Domain.objects.filter(code=domain_code)
            .select_related("partner", "partner__domain")
            .first()
        )

        if not domain:
            raise CustomNotFound("Домен не найден")

        return domain

    def _is_blocked_access(self, domain: Domain, request: HttpRequest) -> bool:
        partner = domain.partner
        expected_url = domain.url
        request_host = self._get_request_host(request)

        return any(
            [
                domain.status == DomainStatus.NOT_ACTIVE,
                not partner.is_active,
                expected_url and expected_url != request_host,
            ]
        )
