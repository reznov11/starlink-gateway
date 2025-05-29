import json
import requests
from typing import Any
from datetime import datetime
from requests import Response
from core.logger import log_app
from django.conf import settings
from apps.proposal.models import Proposal, CreatioProposal


class CreatioCrm(requests.Session):
    def __init__(self, module_name, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.module_name = module_name
        self.base_url = f'{settings.CREATIO_API}/api/v1'

    def request(self, method, url, *args, **kwargs):
        # Prepend the base URL if it's provided
        if self.base_url:
            url = f"{self.base_url}{url}"

        response = super().request(method, url, *args, **kwargs)

        if response.status_code >= 400:
            response.raise_for_status()

        return response

    @staticmethod
    def _crm_json_body(proposal: Proposal) -> dict[str, Any]:
        crm_json: dict = {
            "fullName": proposal.meta.get('fullName', proposal.get_applicant_fullname),
            "phone": proposal.meta.get('phone', proposal.applicant_phone_number),
            "email": proposal.meta.get('email', proposal.applicant_email),
            "product": {
                "title": proposal.get_product,
                "description": proposal.get_product,
                "goal": proposal.meta.get('goal', 'N/A'),
                "amount": proposal.meta.get('amount', 0),
                "cbsId": proposal.meta.get('cbsId', 'N/A'),
                "term": proposal.meta.get('term', 0),
            },
            "source": proposal.source,
            "cbsCustomerId": proposal.meta.get('cbsCustomerId', 'N/A'),
            "dmsResult": proposal.meta.get('dmsResult', False),
            "consentToUsePersonalData": proposal.meta.get('consentToUsePersonalData', False),
        }

        if proposal.source == 'mashinakg':
            vehicle_info: dict = proposal.meta.get('carInfo', {})
            crm_json["vehicle"] = vehicle_info

        if proposal.source == 'housekg':
            restate_info: dict = proposal.meta.get('estateDetails', {})
            crm_json["realEstate"] = {
                "description": restate_info.get('name', '-')
            }

        return crm_json

    def send_proposal(self, proposal: Proposal) -> None:
        """Create a proposal using the stored access token."""
        req_data: dict = self._crm_json_body(proposal=proposal)
        pretty_json = json.dumps(req_data, indent=4, ensure_ascii=False)
        server_resp: Response | None = None

        try:
            proposal_endpoint = '/public/leads/marketplace'

            resp: Response = self.post(proposal_endpoint, json=req_data, verify=False)
            server_resp = resp

            log_text = f'\nCode: {str(resp.status_code)}'
            log_text += f'\n\nHeaders:\n {str(resp.headers)}'
            log_text += f'\n\nJson:\n {pretty_json}'

            if resp.status_code == 201:
                resp_data: dict = resp.json()
                log_text += f'\n\nResponse:\n {str(resp_data)}'
                create_proposal_record: CreatioProposal = CreatioProposal.objects.create(
                    proposal=proposal,
                    cid=resp_data['id']
                )

            self._log(log_text)

        except Exception as exc:
            dtime_now: datetime = datetime.now()
            error_log_text: str = f'[-] {dtime_now:%Y-%m-%d %H:%M:%S} - Creatio Error: {str(exc)}\n'
            error_log_text += '-'*10
            error_log_text += f"\nData {pretty_json}\n"

            if isinstance(server_resp, Response):
                error_log_text += '-'*10
                error_log_text += f"\nServer response {str(server_resp.text)}\n"

            error_log_text += "="*25

            print(error_log_text)

    def _log(self, message):
        log_app(self.module_name, is_specific_module_log=True).error(message, exc_info=True)
