from typing import Any, Generator
from django.http import HttpRequest
from django.db.models import QuerySet
from django.contrib.admin import SimpleListFilter, ModelAdmin

from apps.accounts.models.user import User


class SourceFilter(SimpleListFilter):
    title = 'Источник'
    parameter_name = 'source'

    def lookups(self, request: HttpRequest, queryset: ModelAdmin) -> Generator[tuple[str, str], Any, None]:
        get_sources: Generator[User] = User.objects.filter(
            is_staff=False
        ).values_list('username', 'first_name').distinct()
        return (
            (username, first_name,) for username, first_name in get_sources
        )

    def queryset(self, request: HttpRequest, queryset: QuerySet) -> QuerySet:
        source = request.GET.get('source')

        if source:
            queryset = queryset.filter(source=source)

        return queryset
