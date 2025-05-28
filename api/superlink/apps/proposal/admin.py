import json

from apps.proposal.models import Proposal
from pygments import highlight
from django.contrib import admin
from django.conf import settings
from django.http import HttpRequest
from pygments.lexers import JsonLexer
from .admin_filters import SourceFilter
from .admin_actions import export_to_xls
from django.utils.safestring import mark_safe
from pygments.formatters import HtmlFormatter
from rangefilter.filters import DateRangeFilterBuilder

from apps.accounts.models.user import User


# Register your models here.


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    def has_add_permission(self, request: HttpRequest):
        return False

    @admin.display(description='JSON мета данных')
    def meta_data_prettified(self, instance: Proposal) -> mark_safe:
        """Function to display pretty version of source meta data"""

        response = json.dumps(instance.meta, sort_keys=True, indent=4, ensure_ascii=False)
        # response = response[:5000]  # slice the list to get up to 5000 chars only
        formatter = HtmlFormatter(style='emacs')
        response = highlight(response, JsonLexer(), formatter)
        style = "<style>" + formatter.get_style_defs() + "</style><br>"
        return mark_safe(style + response)

    @admin.display(description='ФИО')
    def get_applicant_fullname(self, instance: Proposal) -> str:
        """Function to display fullname of the applicant"""
        return instance.get_applicant_fullname

    @admin.display(description='Отчество заявителя')
    def get_applicant_middle_name(self, instance: Proposal) -> str:
        """Function to display middle name of the applicant"""
        return instance.applicant_middle_name or '-'

    @admin.display(description='Статус')
    def get_status(self, instance: Proposal) -> mark_safe:
        """Function to get the status of a proposal"""
        full_image_path: str = 'images/icon-{img_path}'
        path = f'<img src="{settings.STATIC_URL}{full_image_path}">'
        status_icon = mark_safe(path.format(img_path='yes.svg' if instance.status else 'no.svg'))
        markup_text = mark_safe(
            status_icon + f'<span>{instance.get_status_display()}</span>'
        )
        return markup_text

    @admin.display(description='Продукт')
    def get_product(self, instance: Proposal) -> str:
        """Function to get product name"""
        return instance.get_product

    @admin.display(description='Обработано')
    def get_user_after_status_change(self, instance: Proposal) -> str:
        """Function to get the last change of a proposal"""
        return instance.get_user_log_entry

    @admin.display(description='Дата и время обработки')
    def get_status_change_datetime(self, instance: Proposal) -> str:
        """Function to get date and time of last change of a proposal"""
        return instance.get_user_log_entry_datetime

    @admin.display(description='Источник')
    def get_source(self,  instance: Proposal) -> str:
        """Function to get display name of the source"""
        get_user: User = User.objects.filter(username=instance.source).first()

        if get_user and get_user.get_full_name():
            return get_user.get_full_name() or '-'

        return instance.source

    def get_actions(self, request) -> dict:
        """Function to remove 'export to file' option from the list of not allowed users"""
        actions = super().get_actions(request)
        allowed_users: list[str] = settings.ALLOWED_USERS_ACTIONS

        if request.user.username not in allowed_users:
            if 'export_to_xls' in actions:
                del actions['export_to_xls']

        return actions

    list_filter = (
        SourceFilter,
        'status',
        ("created_at", DateRangeFilterBuilder()),
    )
    list_display = (
        'get_source',
        'get_applicant_fullname', 
        'applicant_phone_number', 
        'created_at',
        'get_product',
        'get_user_after_status_change',
        'get_status_change_datetime',
        'get_status',
    )
    readonly_fields = (
        'created_at', 
        'source', 
        'applicant_email',
        'applicant_first_name',
        'applicant_lastname',
        'get_applicant_middle_name',
        'applicant_phone_number', 
        'meta_data_prettified',
    )
    list_per_page = 30
    exclude = ('meta', 'applicant_middle_name',)
    actions = (export_to_xls,)

    export_to_xls.short_description = "Выгрузить выбранных в XLS файл"


# admin.site.unregister(Group)
