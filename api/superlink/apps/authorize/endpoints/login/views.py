from typing import Union
from knox.models import AuthToken
from rest_framework.views import APIView
from django.http.request import QueryDict
from knox.auth import TokenAuthentication
from apps.accounts.models.user import User
from rest_framework.response import Response
from rest_framework import permissions, status
from knox.views import LoginView as KnoxLoginView
from django.http import HttpRequest, JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.signals import user_logged_out
from django.shortcuts import get_object_or_404, render
from apps.authorize.endpoints.login.serializers import CustomLoginSerializer

from apps.domains.models import Domain
from apps.constructor.models import Constructor
from apps.domains.models.domain import DomainStatus

from core.exceptions import CustomNotFound, CustomFatalException


# Create your views here.


class IndexView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            params: QueryDict = self.request.GET
            domain_code_param: str | None = params.get('ifr_code', None)
            domain: Domain = self._get_check_domain(domain_code=domain_code_param)
            is_secured_content: bool = self._dont_show_content(domain=domain)

            if is_secured_content:
                return JsonResponse({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

            return render(
                template_name='index.html',
                request=self.request,
                context={'partner_form': self._get_partner_form(domain=domain)},
                status=status.HTTP_202_ACCEPTED
            )
        except Exception as exc:
            print("Error: ", str(exc))
            error_test: str = 'Внутреняя ошибка'
            raise CustomFatalException(error_test)

    @staticmethod
    def _get_check_domain(domain_code: str) -> Domain:
        domain: Domain = Domain.objects.filter(code=domain_code).first()

        if not domain:
            raise CustomNotFound('Домен не найден')

        return domain

    def _dont_show_content(self, domain: Domain) -> bool:
        return domain and any([
            domain.status == DomainStatus.NOT_ACTIVE,
            domain.partner and not domain.partner.is_active,
            domain.url != self._get_request_host()
        ])

    def _get_request_host(self) -> str:
        current_host: str = self.request.get_host()
        current_origin = f'{self.request.scheme}://{current_host}'
        return current_origin

    @staticmethod
    def _get_partner_form(domain: Domain) -> Constructor | None:
        if domain.partner:
            return Constructor.objects.filter(partner=domain.partner).first()

        return None


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    _default_error_msg = 'Неверный логин или пароль'
    _default_status_code = status.HTTP_400_BAD_REQUEST

    def post(self, request: HttpRequest) -> Union[Response, KnoxLoginView]:
        serializer = CustomLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = User.objects.filter(email=email).first()

        if not self._validate_user(user, password):
            return Response({'error': self._default_error_msg}, status=self._default_status_code)

        if self._cannot_login(user):
            return Response({'error': 'Доступ закрыт'}, status=status.HTTP_401_UNAUTHORIZED)

        _, token = AuthToken.objects.create(user)
        return Response({'token': token}, status=status.HTTP_200_OK)

    @staticmethod
    def _validate_user(user: User, password: str) -> bool:
        return user and user.check_password(password)

    @staticmethod
    def _forbidden(user: User) -> bool:
        return any([
            not user.is_super_admin,
            not user.is_employee,
        ])

    @staticmethod
    def _cannot_login(user: User) -> bool:
        return any([
            not user.is_active,
            not user.is_staff,
        ])

    @staticmethod
    def _get_user_roles(user: User) -> list:
        all_permissions = user.get_all_permissions()
        return all_permissions


class LogoutView(KnoxLoginView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request: HttpRequest, format: Union[str, None] = None) -> Response:
        request._auth.delete()
        user_logged_out.send(
            sender=request.user.__class__,
            request=request, user=request.user
        )
        return Response({}, status=status.HTTP_205_RESET_CONTENT)
