import datetime
from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in, user_logged_out


class UserAuthHistory(models.Model):
    class Meta:
        ordering = ['-date_time']
        verbose_name = 'История входа'
        verbose_name_plural = 'Истории входов'
        app_label = 'admin'
        db_table = 'auth_history'

    user = models.ForeignKey(
        get_user_model(),
        verbose_name='Пользователь',
        on_delete=models.CASCADE,
        related_name='login_histories'
    )
    ip = models.CharField(
        verbose_name='IP Адрес',
        max_length=15,
        blank=True,
        null=True
    )
    user_agent = models.TextField(
        verbose_name='Браузерные юзер-агенты',
        blank=True
    )
    date_time = models.DateTimeField(
        verbose_name='Дата и время',
        auto_now_add=True
    )
    is_login = models.BooleanField(
        verbose_name='Авторизация',
        default=True
    )
    is_logged_in = models.BooleanField(
        verbose_name='Залогиненный пользователь',
        default=True
    )

    @property
    def get_user_full_name(self):
        if any([self.user.first_name, self.user.last_name]):
            return "%s %s" % (self.user.first_name, self.user.last_name)
        return self.user.username

    def __str__(self):
        return f"{self.id} - {self.user} - {self.ip}"

    def __eq__(self, other):
        return self.ip == other.ip and self.user_agent == other.user_agent

    def __hash__(self):
        return hash(('ip', self.ip, 'user_agent', self.user_agent))


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def delete_old_login_histories(user):
    if settings.LOGIN_HISTORY_DELETE_OLD:
        today = datetime.date.today()

        if settings.LOGIN_HISTORY_KEEP_DAYS:
            days_x_ago = today - \
                datetime.timedelta(days=settings.LOGIN_HISTORY_KEEP_DAYS)
            objs = UserAuthHistory.objects.filter(
                date_time__lte=days_x_ago, user=user).order_by('-date_time')
            objs.delete()
        elif settings.LOGIN_HISTORY_KEEP_LAST:
            objs = UserAuthHistory.objects.filter(user=user) \
                .order_by('-date_time')[:settings.LOGIN_HISTORY_KEEP_LAST] \
                .values_list("id", flat=True)
            objs = UserAuthHistory.objects.exclude(pk__in=list(objs))
            objs.delete()


@receiver(user_logged_in)
def post_login(sender, user, request, **kwargs):
    ip = get_client_ip(request)
    UserAuthHistory.objects.create(
        user=user,
        ip=ip,
        user_agent=request.META.get('HTTP_USER_AGENT', 'Blahblah!'),
        is_login=True
    )
    delete_old_login_histories(user)


@receiver(user_logged_out)
def post_logout(sender, user, request, **kwargs):
    if user:
        ip = get_client_ip(request)
        UserAuthHistory.objects.create(
            user=user,
            ip=ip,
            user_agent=request.META['HTTP_USER_AGENT'],
            is_logged_in=False,
            is_login=False
        )

        UserAuthHistory.objects.filter(
            user=user, ip=ip, user_agent=request.META['HTTP_USER_AGENT']) \
            .update(is_logged_in=False)
    delete_old_login_histories(user)


# adding custom methods to default User model
@property
def active_logins(self):
    """Check user's active logins"""

    active_login_data = self.login_histories.filter(is_logged_in=True)

    active_login = list(set(active_login_data))
    return sorted(active_login, key=lambda item: item.date_time)[::-1]


UserModel = get_user_model()
UserModel.add_to_class("active_logins", active_logins)
