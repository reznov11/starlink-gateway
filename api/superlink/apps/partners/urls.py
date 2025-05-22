from django.urls import path
from apps.partners.endpoints.partner.views import (
    PartnerListView,
    PartnerCreateView,
    PartnerUpdateView,
    PartnerDestroyView
)

from apps.partners.endpoints.portal.views import PackManifest, PortalView

urlpatterns = [
    path('', PartnerListView.as_view(), name='partner-list'),
    path('create/', PartnerCreateView.as_view(), name='partner-create'),
    path('<uuid:partner_id>/update/', PartnerUpdateView.as_view(), name='partner-update'),
    path('<uuid:partner_id>/delete/', PartnerDestroyView.as_view(), name='partner-delete'),

    path('manifest/', PackManifest.as_view(), name='mainfest'),
    path('portal/', PortalView.as_view(), name='portal'),
]
