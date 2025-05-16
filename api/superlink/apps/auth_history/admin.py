from django.contrib import admin
from .models.login_history import UserAuthHistory


@admin.register(UserAuthHistory)
class UserAuthHistoryAdmin(admin.ModelAdmin):
    list_filter = ['user', 'is_login', 'is_logged_in', 'date_time']
    search_fields = ['ip', 'user']
    exclude = ('id', 'user',)

    def get_list_display(self, request):
        fields = self.model._meta.fields
        fields = [field.name for field in fields if field.name not in self.exclude]
        fields.append('get_user')
        fields.append('get_action_status')
        return fields

    def get_readonly_fields(self, request, obj=None):
        return self.get_list_display(request)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_save_and_continue'] = False
        extra_context['show_save'] = False
        return super(UserAuthHistoryAdmin, self) \
            .changeform_view(request, object_id, extra_context=extra_context)

    @admin.display(description="Пользователь")
    def get_user(self, obj=None):
        # User.full_name = property(lambda u: u"%s %s" % (obj.user.first_name, obj.user.last_name))
        return obj.get_user_full_name

    @admin.display(description="Статус")
    def get_action_status(self, obj):
        if obj.is_login:
            return "Вошёл"
        return "Вышёл"
