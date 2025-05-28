from typing import Dict, List, Union
from rest_framework import serializers
from apps.proposal.models import Proposal
from django.http.request import QueryDict
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework.serializers import ModelSerializer
from rest_framework import permissions, status, viewsets
from apps.proposal.serializers import ProposalSerializer

from rest_framework.views import APIView
from apps.authorize.permissions import TrustedDomain
from core.exceptions import CustomNotFound, CustomBadRequest, CustomFatalException


# Create your views here.


class ProposalViewSet(APIView):
    # serializer_class: ModelSerializer = ProposalSerializer
    http_method_names = ['post']
    permission_classes: List[BasePermission] = [
        TrustedDomain
    ]

    def post(self, request: Response) -> Union[Response, Dict[str, str]]:
        """
        This function is to create a new proposal.
        """

        domain = getattr(request, 'domain', None)

        if domain is None:
            raise CustomNotFound('Домен не найден.')

        if not domain.partner.source:
            raise CustomBadRequest('Источник не найден')

        proposal_data: QueryDict = request.data

        try:
            if 'csrfmiddlewaretoken' in proposal_data:
                proposal_data.pop('csrfmiddlewaretoken')

            proposal_data.update(
                {
                    'source': domain.partner.source
                }
            )

            base_data_fields: list[str] = [
                'email',
                'fullname',
                'phone_number',
                'source',
                'agreement'
            ]

            proposal_data.update({
                'meta': {
                    'product': proposal_data.get('product', '-'),
                    **{
                        key: value for key, value in proposal_data.items() \
                        if key not in base_data_fields
                    }
                }
            })
            serializer: ModelSerializer = ProposalSerializer(data=proposal_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({}, status=status.HTTP_201_CREATED)

        except serializers.ValidationError as exc:
            print(exc)
            raise CustomBadRequest(str(exc.detail))

        except Exception as exc:
            print(exc)
            raise CustomFatalException('Внутреняя ошибка сервера, повторите попытку позже.')
