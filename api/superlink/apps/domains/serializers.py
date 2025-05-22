from typing import Any
from rest_framework import serializers
from .models.domain import Domain, DomainStatus
from apps.partners.models.partner import Partner
from django.shortcuts import get_object_or_404
from apps.partners.serializers import PartnerSerializer


class DomainInfoSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True)

    class Meta:
        model = Domain
        fields = ['id', 'code', 'url']


class DomainListSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True)
    partner = PartnerSerializer(read_only=True)

    class Meta:
        model = Domain
        fields = ['id', 'code', 'url', 'status', 'partner', 'created_at']
        read_only_fields = ['code', 'created_at']


class DomainCreateSerializer(serializers.ModelSerializer):
    url = serializers.URLField(required=True)
    partner = PartnerSerializer(read_only=True)

    class Meta:
        model = Domain
        fields = ['url', 'status', 'partner']

    def validate_url(self, value):
        if Domain.objects.filter(url=value).exists():
            raise serializers.ValidationError("Такой домен уже существует")
        return value
    
    def validate_status(self, value):
        if value not in dict(DomainStatus.choices):
            raise serializers.ValidationError("Неверное значение статуса")
        return value

    def create(self, validated_data: dict[str, Any]):
        if validated_data.get('partner'):
            partner_id = validated_data.pop('partner')
            partner = get_object_or_404(Partner, public_id=partner_id['public_id'])
            validated_data['partner'] = partner

        domain = Domain.objects.create(**validated_data)

        return domain


class DomainUpdateSerializer(serializers.ModelSerializer):
    url = serializers.URLField(required=False)
    partner = serializers.UUIDField(source='partner.public_id', required=False)

    class Meta:
        model = Domain
        fields = ['url', 'status', 'partner']

    def validate_status(self, value):
        if value not in dict(DomainStatus.choices):
            raise serializers.ValidationError("Неверное значение статуса")
        return value

    def update(self, instance, validated_data):
        partner = validated_data.pop('partner')
        partner = get_object_or_404(Partner, public_id=partner['public_id'])
        validated_data['partner'] = partner
        return super().update(instance, validated_data)
