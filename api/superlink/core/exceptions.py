from rest_framework import status
from rest_framework.exceptions import NotFound, APIException


class CustomNotFound(NotFound):
    default_detail = 'Message: The requested resource could not be found.'
    default_code = status.HTTP_404_NOT_FOUND


class CustomFatalException(APIException):
    default_detail = 'Message: 500 server error.'
    default_code = status.HTTP_500_INTERNAL_SERVER_ERROR
