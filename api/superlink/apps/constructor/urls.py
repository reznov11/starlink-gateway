from django.urls import path
from apps.constructor.endpoints.constructor.views import (
    ConstructorListView,
    ConstructorCreateView,
    ConstructorUpdateView,
    ConstructorDestroyView,
    ConstructorDetailView
)

urlpatterns = [
    path('', ConstructorListView.as_view(), name='constructor-list'),
    path('create/', ConstructorCreateView.as_view(), name='constructor-create'),
    path('<uuid:constructor_id>/', ConstructorDetailView.as_view(), name='constructor-detail'),
    path('<uuid:constructor_id>/update/', ConstructorUpdateView.as_view(), name='constructor-update'),
    path('<uuid:constructor_id>/delete/', ConstructorDestroyView.as_view(), name='constructor-delete'),
]
