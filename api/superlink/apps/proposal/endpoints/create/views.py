from typing import Dict, List, Union
from rest_framework import serializers
from apps.proposal.models import Proposal
from django.http.request import QueryDict
from rest_framework.response import Response
from apps.authorize.permissions import IsActiveUser
from rest_framework.permissions import BasePermission
from rest_framework.serializers import ModelSerializer
from rest_framework import permissions, status, viewsets
from apps.proposal.serializers import ProposalSerializer

# Create your views here.


class ProposalViewSet(viewsets.ModelViewSet):
    queryset: List[Proposal] = Proposal.objects.all()
    serializer_class: ModelSerializer = ProposalSerializer
    permission_classes: List[BasePermission] = [
        permissions.IsAuthenticated,
        IsActiveUser
    ]
    http_method_names = ['post']

    def create(self, request: Response) -> Union[Response, Dict[str, str]]:
        """
        This function is to create a new proposal.
        """

        try:
            proposal_data: QueryDict = request.data
            proposal_data.update({'source': request.user.username})
            serializer: ModelSerializer = self.get_serializer(data=proposal_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({'message': 'ok'}, status=status.HTTP_201_CREATED)

        except serializers.ValidationError as exc:
            print(exc)
            return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as exc:
            print(exc)
            return Response({'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
