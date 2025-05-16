from .models.user import User
from django.contrib import admin
from knox.models import AuthToken
from knox.admin import AuthTokenAdmin
from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('email', 'role', 'first_name', 'last_name')}),
        ('Уровень риска', {'fields': ('risk_level', 'risk_comment')}),
        ('Прав', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Даты', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        ('Безопасность', {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'role',),
        }),
    )

    list_display = ('username', 'get_full_name', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'email')
    ordering = ('username',)

    @admin.display(description='ФИО')
    def get_full_name(self, obj):
        return obj.get_full_name()


admin.site.register(User, CustomUserAdmin)

try:
    admin.site.unregister(AuthToken)
except Exception as e:
    print(f"Error unregistering AuthToken: {e}")
