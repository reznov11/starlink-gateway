from django.conf import settings
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from django.http import HttpRequest, JsonResponse, HttpResponse
from core.exceptions import CustomNotFound, CustomBadRequest, CustomNotAuthorized

from apps.domains.models import Domain
from apps.constructor.models import Constructor
from apps.domains.models.domain import DomainStatus

import logging

# Create your views here.


class PackManifest(APIView):
    def get(self, request: HttpRequest, *args, **kwargs) -> JsonResponse:
        if all([
            settings.APPLICATION_JS_FILE,
            settings.APPLICATION_CSS_FILE,
            settings.PURIFY_JS_FILE
        ]):
            return JsonResponse(
                {
                    'application.js': settings.APPLICATION_JS_FILE,
                    'purify.js': settings.PURIFY_JS_FILE,
                    'application.css': settings.APPLICATION_CSS_FILE,
                },
                status=status.HTTP_202_ACCEPTED
            )

        return JsonResponse(
            {},
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


class PortalView(APIView):
    _logger = logging.getLogger(__name__)

    def get(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        domain_code = request.GET.get('ifr_code', '').strip()

        if not domain_code:
            raise CustomBadRequest('Код домена не передан')

        domain = self._get_valid_domain(domain_code)
        if not domain or not domain.partner:
            raise CustomNotAuthorized('Несанкционированный доступ')

        if self._is_blocked_access(domain=domain):
            self._logger.warning(f"Доступ запрещен: Домен {domain.code}, URL: {self._get_request_host(request)}")
            raise CustomNotAuthorized('Несанкционированный доступ')

        partner_form = self._get_partner_form(domain)

        if not partner_form:
            raise CustomBadRequest('Нет формы.')

        if not self._form_has_components(partner_form):
            raise CustomBadRequest('Нет компонентов.')

        return render(request, 'portal/index.html', {
            'partner_form': partner_form,
            'form_settings': partner_form.settings,
            'partner_id': partner_form.partner.public_id,
            'show_modal': partner_form.settings.get('type') in ['button', 'logo']
        }, status=status.HTTP_202_ACCEPTED)

    def _get_request_host(self, request: HttpRequest) -> str:
        return request.headers.get('X-Partner-Url') or request.get_host()

    def _get_valid_domain(self, domain_code: str) -> Domain:
        domain = Domain.objects.filter(code=domain_code).select_related('partner', 'partner__domain').first()

        if not domain:
            raise CustomNotFound('Домен не найден')

        return domain

    def _is_blocked_access(self, domain: Domain) -> bool:
        partner = domain.partner
        expected_url = domain.url
        request_host = self._get_request_host(self.request)

        return any([
            domain.status == DomainStatus.NOT_ACTIVE,
            not partner.is_active,
            expected_url and expected_url != request_host,
        ])

    def _get_partner_form(self, domain: Domain) -> Constructor | None:
        return Constructor.objects.filter(partner=domain.partner).first()

    def _form_has_components(self, form: Constructor) -> bool:
        return bool(form.components)
