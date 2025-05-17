from django.urls import path
from apps.domains.endpoints.domain.views import (
    DomainListView,
    DomainCreateView,
    DomainUpdateView,
    DomainDestroyView
)

urlpatterns = [
    path('', DomainListView.as_view(), name='domain-list'),
    path('create/', DomainCreateView.as_view(), name='domain-create'),
    path('<uuid:domain_id>/update/', DomainUpdateView.as_view(), name='domain-update'),
    path('<uuid:domain_id>/delete/', DomainDestroyView.as_view(), name='domain-delete'),
]
