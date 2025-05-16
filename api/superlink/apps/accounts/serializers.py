from typing import Any
from django.http import HttpRequest
from rest_framework import serializers
from apps.accounts.models.user import User
from django.contrib.auth import user_logged_out


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='uuid', read_only=True)
    fullname = serializers.CharField(source='get_full_name', allow_blank=True, read_only=True)
    # phone_number = serializers.CharField(allow_blank=True, required=False, allow_null=True)
    # location = serializers.CharField(allow_blank=True, required=False, allow_null=True)
    # job_title = serializers.CharField(allow_blank=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'fullname',
            'first_name',
            'last_name',
            'role',
            'avatar',
            'phone_number',
            'location',
            'birth_date',
            'email',
            'job_title',
            'is_active',
            'is_staff',
        ]


class EditUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(allow_blank=True, required=False)
    username = serializers.CharField(allow_blank=True, required=False)
    email = serializers.EmailField(allow_blank=True, required=False)
    first_name = serializers.CharField(allow_blank=True, required=False)
    last_name = serializers.CharField(allow_blank=True, required=False)
    role = serializers.CharField(allow_blank=True, required=False)
    avatar = serializers.ImageField(allow_null=True, allow_empty_file=True, required=False)
    phone_number = serializers.CharField(allow_blank=True, required=False, allow_null=True)
    location = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    birth_date = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    job_title = serializers.CharField(allow_blank=True, required=False, allow_null=True)
    is_active = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = [
            'uuid',
            'password',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'avatar',
            'phone_number',
            'location',
            'birth_date',
            'email',
            'job_title',
            'is_active',
            'is_staff',
        ]

    def create(self, validated_data: dict[str, Any]):
        password: str | None = validated_data.pop('password', None)
        instance: User = self.Meta.model(**validated_data)

        if password:
            instance.set_password(password)

        try:
            instance.is_superuser = instance.role == 'super_admin'
            instance.save()
        except (User.DoesNotExist, Exception) as exc:
            print(str(exc), end='\n')

        return instance

    def update(self, instance: User, validated_data: dict[str, Any]):
        password_reset: bool = False
        request: HttpRequest = self.context['request']
        password: str | None = validated_data.pop('password', None)

        if password:
            password_reset = True
            instance.set_password(password)

        instance.is_superuser = instance.role == 'super_admin'

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if password_reset:
            if request.user.uuid == instance.uuid:
                request._auth.delete()
                user_logged_out.send(
                    sender=request.user.__class__,
                    request=request, user=request.user
                )

        return instance
