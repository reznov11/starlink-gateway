from typing import Any
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission


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
