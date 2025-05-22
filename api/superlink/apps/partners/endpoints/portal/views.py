from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from django.http import HttpRequest, JsonResponse
from core.exceptions import CustomNotFound, CustomBadRequest, CustomNotAuthorized

from apps.domains.models import Domain
from apps.partners.models import Partner
from apps.constructor.models import Constructor
from apps.domains.models.domain import DomainStatus
from apps.constructor.serializers import ConstructorSerializer

# Create your views here.


class PackManifest(APIView):
    def get(self, request: HttpRequest, *args, **kwargs) -> JsonResponse:
        if settings.APPLICATION_JS_FILE:
            return JsonResponse(
                {
                    'application': settings.APPLICATION_JS_FILE
                },
                status=status.HTTP_202_ACCEPTED
            )

        return JsonResponse(
            {},
            status=status.HTTP_406_NOT_ACCEPTABLE
        )


class PortalView(APIView):
    def get(self, request: HttpRequest, *args, **kwargs) -> JsonResponse:
        params = self.request.GET
        domain_code_param = params.get('ifr_code', None)

        domain = self._get_check_domain(domain_code=domain_code_param)
        dont_show = self._dont_show_content(domain=domain)

        if dont_show:
            raise CustomNotAuthorized('Несанкционированный доступ')

        partner_form = self._get_partner_form(domain=domain)

        if not partner_form:
            raise CustomBadRequest('Нет формы.')

        if not self._form_has_components(form=partner_form):
            raise CustomBadRequest('Нет компонентов.')

        return JsonResponse(
            ConstructorSerializer(partner_form).data,
            status=status.HTTP_202_ACCEPTED
        )

    def _get_request_host(self) -> str:
        current_host: str = self.request.get_host()
        current_origin = f'{self.request.scheme}://{current_host}'
        return current_origin

    @staticmethod
    def _get_check_domain(domain_code: str) -> Domain:
        domain: Domain | None = Domain.objects.filter(code=domain_code).first()

        if not domain:
            raise CustomNotFound('Домен не найден')

        return domain

    @staticmethod
    def _get_partner_form(domain: Domain) -> Constructor | None:
        if domain.partner:
            return Constructor.objects.filter(partner=domain.partner).first()

        return None

    @staticmethod
    def _form_has_components(form: Constructor) -> bool:
        if len(form.components) > 0:
            return True

        return False

    def _dont_show_content(self, domain: Domain) -> bool:
        if not domain.partner:
            return True

        partner: Partner = domain.partner

        return any([
            partner.domain.status == DomainStatus.NOT_ACTIVE,
            not partner or not partner.is_active,
            partner.domain.url != self._get_request_host()
        ])
