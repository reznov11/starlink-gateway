from django.contrib import admin
from .models import Partner


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'login',
        'email',
        'phone_number',
        'category',
        'is_active',
        'public_id',
    )
    list_filter = ('is_active',)
    search_fields = ('name', 'login', 'email', 'phone_number', 'inn', 'public_id')
    readonly_fields = ('public_id', 'created_at', 'updated_at')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {
            'fields': (
                'name', 'login', 'email', 'phone_number',
                'person_contact', 'category', 'inn',
                'logo', 'is_active', 'public_id',
                'created_at', 'updated_at',
            )
        }),
    )
