from django.urls import path
from apps.proposal.endpoints.create.views import ProposalViewSet

app_name = 'proposal'

urlpatterns = [
    path('create/', ProposalViewSet.as_view(), name="create")
    # path('create/', ProposalViewSet.as_view({'post': 'create'}), name="create")
]
