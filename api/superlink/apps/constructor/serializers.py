from typing import Any
from rest_framework import serializers
from .models.constructor import Constructor
from apps.partners.models.partner import Partner
from django.shortcuts import get_object_or_404
from apps.partners.serializers import PartnerSerializer
from apps.accounts.serializers import UserSerializer


class ConstructorSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True)
    partner = serializers.CharField(source='partner.public_id')
    settings = serializers.JSONField(required=False)

    class Meta:
        model = Constructor
        fields = ['id', 'title', 'partner', 'components_total', 'components', 'settings']


class ConstructorListSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True)
    partner = PartnerSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    settings = serializers.JSONField(required=False)

    class Meta:
        model = Constructor
        fields = ['id', 'title', 'partner', 'user', 'components_total', 'components', 'created_at', 'settings']
        read_only_fields = ['created_at']


class ConstructorCreateSerializer(serializers.ModelSerializer):
    partner = serializers.CharField(source='partner.public_id', required=True)
    user = UserSerializer(read_only=True)
    settings = serializers.JSONField(required=False)

    class Meta:
        model = Constructor
        fields = ['title', 'partner', 'components_total', 'components', 'user', 'settings']

    def create(self, validated_data: dict[str, Any]):
        if validated_data.get('partner'):
            partner_id = validated_data.pop('partner')
            partner = get_object_or_404(Partner, public_id=partner_id['public_id'])
            validated_data['partner'] = partner

        validated_data['user'] = self.context['request'].user
        form = Constructor.objects.create(**validated_data)

        return form


class ConstructorUpdateSerializer(serializers.ModelSerializer):
    partner = serializers.CharField(source='partner.public_id', required=False)
    user = UserSerializer(read_only=True)
    settings = serializers.JSONField(required=False)

    class Meta:
        model = Constructor
        fields = ['title', 'partner', 'components_total', 'components', 'user', 'settings']

    def update(self, instance, validated_data):
        partner = validated_data.pop('partner')
        partner = get_object_or_404(Partner, public_id=partner['public_id'])
        validated_data['partner'] = partner
        return super().update(instance, validated_data)
