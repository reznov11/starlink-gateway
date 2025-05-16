from typing import Union
from knox.models import AuthToken
from django.http import HttpRequest
from apps.accounts.models.user import User
from rest_framework.views import APIView
from knox.auth import TokenAuthentication
from rest_framework.response import Response
from rest_framework import permissions, status
from knox.views import LoginView as KnoxLoginView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.signals import user_logged_out
from apps.authorize.endpoints.login.serializers import CustomLoginSerializer


# Create your views here.


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
