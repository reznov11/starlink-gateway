from rest_framework.views import APIView
from knox.auth import TokenAuthentication
from apps.authorize.permissions import IsActiveUser
from rest_framework.permissions import IsAuthenticated


class BaseAuthorizeView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsActiveUser,)
