from typing import List

from django.urls import reverse
from django.conf import settings
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from core.exceptions import CustomNotFound, CustomBadRequest
from django.http import HttpRequest, JsonResponse, HttpResponse

from apps.domains.models import Domain
from apps.constructor.models import Constructor
from apps.authorize.permissions import TrustedDomain


# Create your views here.


class PackManifest(APIView):
    def get(self, request: HttpRequest, *args, **kwargs) -> JsonResponse:
        if all(
            [
                settings.APPLICATION_JS_FILE,
                settings.APPLICATION_CSS_FILE,
                settings.PURIFY_JS_FILE,
            ]
        ):
            return JsonResponse(
                {
                    "application.js": settings.APPLICATION_JS_FILE,
                    "purify.js": settings.PURIFY_JS_FILE,
                    "application.css": settings.APPLICATION_CSS_FILE,
                    "origins": settings.IFRAME_APPLICATION_TRUSTED_ORIGINS,
                },
                status=status.HTTP_202_ACCEPTED,
            )

        return JsonResponse({}, status=status.HTTP_406_NOT_ACCEPTABLE)


class PortalView(APIView):
    permission_classes: List = [
        TrustedDomain
    ]

    def get(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        domain_code = request.GET.get("ifr_code", "").strip()
        domain = Domain.objects.filter(code=domain_code).first()
        partner_form = domain.partner.constructors.first()

        if not partner_form:
            raise CustomBadRequest("Нет формы.")

        if not self._form_has_components(partner_form):
            raise CustomBadRequest("Нет компонентов.")

        relative_action_url = reverse('api:proposal:create')

        return render(
            request,
            "portal/index.html",
            {
                "action_url": request.build_absolute_uri(relative_action_url),
                "partner_form": partner_form,
                "domain_code": domain.code,
                "form_settings": partner_form.settings,
                "partner_id": partner_form.partner.public_id,
                "show_modal": partner_form.settings.get("type") in ["button", "logo"],
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @staticmethod
    def _form_has_components(form: Constructor) -> bool:
        return bool(form.components)
