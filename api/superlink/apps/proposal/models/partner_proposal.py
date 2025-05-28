from django.db import models
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType

# Create your models here.


class Proposal(models.Model):
    PROPOSAL_STATUS = (
        ('open', 'Создано'),
        ('closed', 'Закрыта'),
    )

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        db_table = 'proposals'
        ordering = ['-created_at']

    meta = models.JSONField(default=dict)
    source = models.CharField(verbose_name='Источник', max_length=255)
    created_at = models.DateTimeField(verbose_name="Создано", auto_now_add=True)
    applicant_first_name = models.CharField(verbose_name="Имя заявителя", max_length=255, null=True, blank=True)
    applicant_email = models.CharField(verbose_name="Почта", max_length=255, null=True, blank=True)
    applicant_lastname = models.CharField(verbose_name="Фамилия заявителя", max_length=255, null=True, blank=True)
    applicant_middle_name = models.CharField(verbose_name="Отчество заявителя", max_length=255, null=True, blank=True)
    applicant_phone_number = models.CharField(verbose_name="Номер заявителя", max_length=255)
    status = models.CharField(verbose_name='Статус', choices=PROPOSAL_STATUS, max_length=10)

    def __str__(self):
        return self.get_applicant_fullname

    @property
    def get_applicant_fullname(self):
        applicant_fullname = f'{self.applicant_lastname}'
        applicant_fullname += f' {self.applicant_first_name}'

        if self.applicant_middle_name:
            applicant_fullname += f' {self.applicant_middle_name}'

        if 'fullName' in self.meta:
            applicant_fullname = self.meta['fullName']

        return applicant_fullname

    @property
    def get_product(self):
        product: str = '-'
        meta_data: dict = self.meta

        if 'product' in meta_data:
            p_product: str | None = meta_data.get('product', None)

            if p_product:
                product: str = p_product

        # Deprecated logic
        '''
        if 'carInfo' in meta_data:
            car_product: str | None = meta_data.get('carInfo', None)

            if car_product:
                product = car_product[['brandModel']]

        if 'estateDetails' in meta_data:
            estate_product: str | None = meta_data.get('estateDetails', None)

            if estate_product:
                product = estate_product['name']
        '''

        return product

    @property
    def get_product_price(self) -> int:
        price: int = 0
        meta_data: dict = self.meta

        try:
            if self.source == 'mashinakg':
                price = meta_data.get('carInfo')['price']

            if self.source == 'housekg':
                price = meta_data.get('estateDetails')['price']
        except Exception as exc:
            pass

        return price

    @property
    def get_user_log_entry(self) -> str:
        # Get the user of the last log entry record
        log_entries: list[LogEntry] = self.get_last_log_changes

        if log_entries.exists():
            first_change = log_entries.first()
            user = first_change.user.get_full_name()

            if user:
                return user

        return '-'

    @property
    def get_user_log_entry_datetime(self) -> str:
        # Get date and time of the last log entry record
        log_entries: list[LogEntry] = self.get_last_log_changes

        if log_entries.exists():
            first_change = log_entries.first()
            return first_change.action_time

        return '-'

    @property
    def get_last_log_changes(self):
        # Get the last log entries
        content_type = ContentType.objects.get_for_model(Proposal)
        log_entries = LogEntry.objects.filter(
            content_type=content_type, object_id=self.pk
        ).order_by('action_time')
        return log_entries


class CreatioProposal(models.Model):
    class Meta:
        db_table = 'creatio_proposals'

    proposal = models.ForeignKey(to='Proposal', on_delete=models.CASCADE, related_name='proposal')
    cid = models.UUIDField()
