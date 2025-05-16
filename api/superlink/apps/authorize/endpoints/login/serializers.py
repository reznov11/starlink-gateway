from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class TokenObtainPairSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.id
        return token

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:

            user = authenticate(
                request=self.context.get('request'),
                phone=email,
                password=password
            )

            if not user:
                raise serializers.ValidationError(
                    {'detail': 'Неверный логин или пароль, или пользователь заблокирован.'}
                )

            token = AccessToken.for_user(user)
            token['email'] = user.email

            return {
                'access': str(token),
                'username': user.get_full_name(),
            }
        else:
            raise serializers.ValidationError('Логин и пароль обязательны.')


class CustomJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        try:
            return super().get_validated_token(raw_token)
        except AuthenticationFailed as exc:
            print('Error in token validation:', str(exc))
            raise AuthenticationFailed({
                "detail": "Предоставленный токен не действителен",
                "code": "token_not_valid",
                "messages": [
                    {
                        "token_class": "AccessToken",
                        "token_type": "access",
                        "message": "Токен недействителен или истек"
                    }
                ]
            })


class CustomLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()
