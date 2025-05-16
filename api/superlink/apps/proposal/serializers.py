from typing import Dict, Any
from apps.authorize.models import Proposal
from rest_framework import serializers
from core.creatio_service import CreatioCrm
from rest_framework.response import Response


class ProposalSerializer(serializers.Serializer):
    class Meta:
        model = Proposal
        fields = ['created_at', 'source', 'meta', 'middleName', 'lastName', 'firstName', 'phoneNumber']

    source = serializers.CharField()
    meta = serializers.JSONField(required=False)
    middleName = serializers.CharField(source='applicant_middle_name', required=False, allow_blank=True)
    lastName = serializers.CharField(required=True, source='applicant_lastname')
    firstName = serializers.CharField(required=True, source='applicant_first_name')
    phoneNumber = serializers.CharField(required=True, source='applicant_phone_number')

    def create(self, validated_data: Dict[str, Any]):
        proposal = Proposal.objects.create(**validated_data)

        # Send proposal to Creatio CRM
        creatio: CreatioCrm = CreatioCrm(__name__)
        crm_req: Response = creatio.send_proposal(proposal=proposal)

        return proposal
