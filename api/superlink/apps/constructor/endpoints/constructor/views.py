from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.constructor.models.constructor import Constructor
from apps.constructor.serializers import (
    ConstructorListSerializer,
    ConstructorCreateSerializer,
    ConstructorUpdateSerializer,
    ConstructorSerializer
)
from apps.authorize.mixins import BaseAuthorizeView
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView


class ConstructorListView(BaseAuthorizeView, ListAPIView):
    queryset = Constructor.objects.all()
    serializer_class = ConstructorListSerializer
    permission_classes = BaseAuthorizeView.permission_classes

    def get_queryset(self):
        return Constructor.objects.all().order_by('-created_at')


class ConstructorDetailView(BaseAuthorizeView, RetrieveAPIView):
    queryset = Constructor.objects.all()
    serializer_class = ConstructorSerializer
    permission_classes = BaseAuthorizeView.permission_classes
    lookup_field = 'public_id'
    lookup_url_kwarg = 'constructor_id'

    def get_object(self):
        return Constructor.objects.get(public_id=self.kwargs['constructor_id'])


class ConstructorCreateView(BaseAuthorizeView, CreateAPIView):
    queryset = Constructor.objects.all()
    serializer_class = ConstructorCreateSerializer
    permission_classes = BaseAuthorizeView.permission_classes

    def perform_create(self, serializer):
        serializer.save()


class ConstructorUpdateView(BaseAuthorizeView, UpdateAPIView):
    queryset = Constructor.objects.all()
    serializer_class = ConstructorUpdateSerializer
    permission_classes = BaseAuthorizeView.permission_classes
    lookup_field = 'public_id'
    lookup_url_kwarg = 'constructor_id'

    def get_object(self):
        return Constructor.objects.get(public_id=self.kwargs['constructor_id'])

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ConstructorDestroyView(BaseAuthorizeView, DestroyAPIView):
    queryset = Constructor.objects.all()
    permission_classes = BaseAuthorizeView.permission_classes
    lookup_field = 'public_id'
    lookup_url_kwarg = 'constructor_id'
    
    def get_object(self):
        return Constructor.objects.get(public_id=self.kwargs['constructor_id'])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
