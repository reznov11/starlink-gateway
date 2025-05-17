from django.urls import path
from apps.partners.endpoints.partner.views import (
    PartnerListView,
    PartnerCreateView,
    PartnerUpdateView,
    PartnerDestroyView
)

urlpatterns = [
    path('', PartnerListView.as_view(), name='partner-list'),
    path('create/', PartnerCreateView.as_view(), name='partner-create'),
    path('<uuid:partner_id>/update/', PartnerUpdateView.as_view(), name='partner-update'),
    path('<uuid:partner_id>/delete/', PartnerDestroyView.as_view(), name='partner-delete'),
]
