import uuid
from typing import Union

from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from django.http import HttpRequest
from apps.accounts.models.user import User
from rest_framework.response import Response
from apps.authorize.mixins import BaseAuthorizeView
from apps.authorize.permissions import IsSuperAdmin
from rest_framework.parsers import MultiPartParser, FormParser
from apps.accounts.serializers import UserSerializer, EditUserSerializer


class UsersListCreateView(BaseAuthorizeView):
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)

    def get_queryset(self):
        return User.objects.filter(
            role__in=[User.ROLE_EMPLOYEE]
        )

    def get(self, request: HttpRequest):
        serializer = UserSerializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        roles = {
            'super_admin': User.ROLE_SUPER_ADMIN,
            'employee': User.ROLE_EMPLOYEE
        }

        if data.get('role') not in roles:
            return Response({'error': 'Неверные права'}, status=status.HTTP_400_BAD_REQUEST)

        data['role'] = roles.get(data['role'])

        if not data.get('username'):
            data['username'] = f'user_{uuid.uuid4().hex[:8]}'

        serializer: EditUserSerializer = EditUserSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(BaseAuthorizeView):
    permission_classes = BaseAuthorizeView.permission_classes
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request: HttpRequest, user_id: str):
        try:
            user = User.objects.get(uuid=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Пользователь ненайден'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EditUserSerializer(user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(BaseAuthorizeView):
    permission_classes = BaseAuthorizeView.permission_classes

    def post(self, request: HttpRequest, format: Union[str, None] = None) -> Response:
        user: User = request.user
        user_data: UserSerializer = UserSerializer(user, context={'request': request})
        return Response(user_data.data, status=status.HTTP_200_OK)


class DeleteUserView(BaseAuthorizeView, generics.DestroyAPIView):
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)
    lookup_field = 'uuid'
    lookup_url_kwarg = 'user_id'

    def get_queryset(self):
        user_id: str = self.kwargs.get('user_id')
        return User.objects.filter(uuid=user_id)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset)
        return obj

    def perform_destroy(self, instance):
        instance.delete()


class UserRolesView(BaseAuthorizeView):
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)

    def post(self, request: HttpRequest, format: Union[str, None] = None) -> Response:
        user: User = request.user
        user_roles: dict[str, str | list[str]] = {
            'user_id': user.uuid,
            'roles': user.get_all_permissions(),
        }
        return Response({**user_roles}, status=status.HTTP_200_OK)
