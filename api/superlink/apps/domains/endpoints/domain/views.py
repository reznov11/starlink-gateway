from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.domains.models.domain import Domain
from apps.domains.serializers import (
    DomainListSerializer,
    DomainCreateSerializer,
    DomainUpdateSerializer
)
from apps.authorize.mixins import BaseAuthorizeView
from apps.authorize.permissions import IsSuperAdmin
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView


class DomainListView(BaseAuthorizeView, ListAPIView):
    queryset = Domain.objects.all()
    serializer_class = DomainListSerializer
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)

    def get_queryset(self):
        return Domain.objects.all().order_by('-created_at')


class DomainCreateView(BaseAuthorizeView, CreateAPIView):
    queryset = Domain.objects.all()
    serializer_class = DomainCreateSerializer
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)

    def perform_create(self, serializer):
        serializer.save()


class DomainUpdateView(BaseAuthorizeView, UpdateAPIView):
    queryset = Domain.objects.all()
    serializer_class = DomainUpdateSerializer
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)
    lookup_field = 'public_id'
    lookup_url_kwarg = 'domain_id'

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DomainDestroyView(BaseAuthorizeView, DestroyAPIView):
    queryset = Domain.objects.all()
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)
    lookup_field = 'public_id'
    lookup_url_kwarg = 'domain_id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
