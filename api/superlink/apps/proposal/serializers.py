from typing import Dict, Any
from rest_framework import serializers
from apps.proposal.models import Proposal
from core.creatio_service import CreatioCrm
from rest_framework.response import Response


class ProposalSerializer(serializers.Serializer):
    class Meta:
        model = Proposal
        fields = ['created_at', 'source', 'meta', 'middleName', 'lastName', 'firstName', 'phoneNumber']

    source = serializers.CharField()
    meta = serializers.JSONField(required=False)
    email = serializers.CharField(source='applicant_email', required=False, allow_blank=True)
    middleName = serializers.CharField(source='applicant_middle_name', required=False, allow_blank=True)
    lastName = serializers.CharField(source='applicant_lastname', required=False, allow_blank=True)
    firstName = serializers.CharField(source='applicant_first_name', required=False, allow_blank=True)
    phone = serializers.CharField(required=True, source='applicant_phone_number')

    def create(self, validated_data: Dict[str, Any]):
        proposal = Proposal.objects.create(**validated_data)

        # Send proposal to Creatio CRM
        creatio: CreatioCrm = CreatioCrm(__name__)
        crm_req: Response = creatio.send_proposal(proposal=proposal)

        return proposal
