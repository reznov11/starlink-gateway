from django.urls import path
from apps.partners.endpoints.partner.views import (
    PartnerListView,
    PartnerCreateView,
    PartnerUpdateView,
    PartnerDestroyView
)

from apps.authorize.endpoints.login.views import IndexView

urlpatterns = [
    path('', PartnerListView.as_view(), name='partner-list'),
    path('create/', PartnerCreateView.as_view(), name='partner-create'),
    path('<uuid:partner_id>/update/', PartnerUpdateView.as_view(), name='partner-update'),
    path('<uuid:partner_id>/delete/', PartnerDestroyView.as_view(), name='partner-delete'),
    
    path('portal/', IndexView.as_view(), name='home'),
]
