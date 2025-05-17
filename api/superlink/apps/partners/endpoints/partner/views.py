from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.partners.models import Partner
from apps.partners.serializers import (
    PartnerListSerializer,
    PartnerCreateSerializer,
    PartnerUpdateSerializer
)
from apps.authorize.mixins import BaseAuthorizeView
from apps.authorize.permissions import IsSuperAdmin
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView


class PartnerListView(BaseAuthorizeView, ListAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerListSerializer
    permission_classes = BaseAuthorizeView.permission_classes

    def get_queryset(self):
        return Partner.objects.all().order_by('-created_at')


class PartnerCreateView(BaseAuthorizeView, CreateAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerCreateSerializer
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)

    def perform_create(self, serializer):
        serializer.save()


class PartnerUpdateView(BaseAuthorizeView, UpdateAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerUpdateSerializer
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)
    lookup_field = 'public_id'
    lookup_url_kwarg = 'partner_id'

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PartnerDestroyView(BaseAuthorizeView, DestroyAPIView):
    queryset = Partner.objects.all()
    permission_classes = BaseAuthorizeView.permission_classes + (IsSuperAdmin,)
    lookup_field = 'public_id'
    lookup_url_kwarg = 'partner_id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
