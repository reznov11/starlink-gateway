from typing import Any
from rest_framework import serializers
from .models.partner import Partner
from apps.domains.models.domain import Domain
from django.shortcuts import get_object_or_404


class PartnerSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True)

    class Meta:
        model = Partner
        fields = ['id', 'name']


class PartnerListSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True)
    domain = serializers.CharField(source='domain.public_id', allow_null=True)

    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'inn',
            'created_at',
            'is_active',
            'category',
            'person_contact',
            'domain'
        ]
        read_only_fields = [
            'created_at',
            'is_active',
        ]


class PartnerCreateSerializer(serializers.ModelSerializer):
    domain = serializers.CharField(source='domain.public_id')

    class Meta:
        model = Partner
        fields = [
            'name',
            'domain',
            'inn',
            'category',
            'person_contact'
        ]

    def create(self, validated_data: dict[str, Any]):
        domain_id = validated_data.pop('domain')

        domain = get_object_or_404(Domain, public_id=domain_id['public_id'])
        validated_data['domain'] = domain
        partner = Partner.objects.create(**validated_data)

        return partner


class PartnerUpdateSerializer(serializers.ModelSerializer):
    domain = serializers.CharField(source='domain.public_id')

    class Meta:
        model = Partner
        fields = ['name', 'domain', 'inn', 'category', 'person_contact']

    def validate_status(self, value):
        if value not in dict(Partner.Status.choices):
            raise serializers.ValidationError("Неверное значение статуса.")
        return value
    
    def update(self, instance, validated_data):
        domain = validated_data.pop('domain')
        domain = get_object_or_404(Domain, public_id=domain['public_id'])
        validated_data['domain'] = domain
        return super().update(instance, validated_data)
