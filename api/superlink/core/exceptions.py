from rest_framework import status
from rest_framework.exceptions import NotFound, APIException, ParseError, NotAuthenticated


class CustomNotFound(NotFound):
    default_detail = 'Message: The requested resource could not be found.'
    default_code = status.HTTP_404_NOT_FOUND


class CustomBadRequest(ParseError):
    default_detail = 'Message: Bad request.'
    default_code = status.HTTP_400_BAD_REQUEST


class CustomNotAuthorized(NotAuthenticated):
    default_detail = 'Message: Unauthorized.'
    default_code = status.HTTP_401_UNAUTHORIZED


class CustomFatalException(APIException):
    default_detail = 'Message: 500 server error.'
    default_code = status.HTTP_500_INTERNAL_SERVER_ERROR
