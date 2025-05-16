from django.urls import include, path
from rest_framework.routers import DefaultRouter
from apps.authorize.endpoints.proposal.views import ProposalViewSet


app_name = 'proposal'
router = DefaultRouter()
router.register(r'create', ProposalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
