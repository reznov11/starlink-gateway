from django.contrib import admin
from .models import Domain


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ('url', 'code', 'status', 'partner')
    list_filter = ('status', 'partner')
    search_fields = ('url', 'code')
    readonly_fields = ('code', 'public_id', 'created_at', 'updated_at')
