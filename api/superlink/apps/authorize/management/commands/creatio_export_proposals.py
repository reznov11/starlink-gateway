import sys
import time
from api.superlink.apps.authorize.models import Proposal
from requests.models import Response
from api.superlink.core.creatio_service import CreatioCrm
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Export unprocessed proposals to Creatio CRM"

    def add_arguments(self, parser):
        parser.add_argument('-f', '--from', type=str)
        parser.add_argument('-t', '--to', type=str)

    def handle(self, *args, **options):
        starting_message = "[*] Getting letters"

        from_date = options["from"]
        to_date = options["to"]

        if any([not from_date, not to_date]):
            err_msg = '\nPlease provide date periods, for example: \n\n'
            err_msg += f'python {sys.argv[0]} --from=2023-01-01 --to=2024-01-01 \n'
            self.stdout.write(self.style.ERROR(err_msg))
            return

        try:
            self.stdout.write(self.style.SUCCESS(starting_message))

            batch_size = 5
            offset = 0

            while True:
                get_proposals = Proposal.objects.filter(
                    created_at__date__range=(from_date, to_date),
                    source__in=['mashinakg', 'bakaikg', 'housekg', 'archive'],
                    status=""
                )[offset:offset + batch_size]

                if not get_proposals:
                    break

                for proposal in get_proposals:
                    self._send_to_creatio(proposal)

                time.sleep(3)

                offset += batch_size

        except Exception as exc:
            self.stdout.write(
                self.style.ERROR(
                    f'[-] An error occurred while sending letters: {str(exc)}'
                )
            )

    @staticmethod
    def _send_to_creatio(proposal: Proposal) -> None:
        creatio: CreatioCrm = CreatioCrm()
        crm_req: Response = creatio.send_proposal(proposal=proposal)
