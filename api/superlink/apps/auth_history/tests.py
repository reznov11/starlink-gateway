from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory
from django.contrib.auth.signals import user_logged_in, user_logged_out
from api.superlink.apps.auth_history.models.login_history import UserAuthHistory, delete_old_login_histories, get_client_ip


test_user_agent = 'Mozilla/5.0 (Linux; Android 10; K)' \
    'AppleWebKit/537.36 (KHTML, like Gecko)' \
    'Chrome/128.0.6613.99 Mobile Safari/537.36'

class UserAuthHistoryModelTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='test_user', password='test_password')
        self.auth_history = UserAuthHistory.objects.create(
            user=self.user,
            ip='127.0.0.1',
            user_agent=test_user_agent,
            is_login=True
        )

    def test_user_auth_history_creation(self):
        self.assertEqual(self.auth_history.user, self.user)
        self.assertEqual(self.auth_history.ip, '127.0.0.1')
        self.assertEqual(self.auth_history.user_agent, test_user_agent)
        self.assertTrue(self.auth_history.is_login)
        self.assertTrue(self.auth_history.is_logged_in)

    def test_user_auth_history_str(self):
        self.assertEqual(str(self.auth_history), f"{self.auth_history.id} - {self.user} - 127.0.0.1")

    def test_get_user_full_name(self):
        self.user.first_name = 'Ammar'
        self.user.last_name = 'Z.'
        self.user.save()
        self.assertEqual(self.auth_history.get_user_full_name, 'Ammar Z.')

        self.user.first_name = ''
        self.user.last_name = ''
        self.user.save()
        self.assertEqual(self.auth_history.get_user_full_name, str(self.user))


class DeleteOldLoginHistoriesTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='test_user', password='test_password')
        settings.LOGIN_HISTORY_DELETE_OLD = True
        settings.LOGIN_HISTORY_KEEP_DAYS = 7
        settings.LOGIN_HISTORY_KEEP_LAST = 5

    def test_delete_old_login_histories_by_days(self):
        for i in range(10):
            UserAuthHistory.objects.create(
                user=self.user,
                ip='127.0.0.1',
                user_agent=test_user_agent,
                date_time=timezone.now() - timezone.timedelta(days=i)
            )
        delete_old_login_histories(self.user)
        self.assertEqual(UserAuthHistory.objects.filter(user=self.user).count(), 10)

    def test_delete_old_login_histories_keep_last(self):
        settings.LOGIN_HISTORY_KEEP_DAYS = None
        for i in range(10):
            UserAuthHistory.objects.create(
                user=self.user,
                ip='127.0.0.1',
                user_agent=test_user_agent,
                date_time=timezone.now() - timezone.timedelta(days=i)
            )
        delete_old_login_histories(self.user)
        self.assertEqual(UserAuthHistory.objects.filter(user=self.user).count(), 5)


class UserAuthHistorySignalsTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = get_user_model().objects.create_user(username='test_user', password='test_password')

    def test_post_login_signal(self):
        request = self.factory.get('/')
        request.user = self.user
        request.META['REMOTE_ADDR'] = '127.0.0.1'
        request.META['HTTP_USER_AGENT'] = test_user_agent

        user_logged_in.send(sender=self.user.__class__, request=request, user=self.user)

        self.assertEqual(UserAuthHistory.objects.filter(user=self.user, is_login=True).count(), 1)

    def test_post_logout_signal(self):
        request = self.factory.get('/')
        request.user = self.user
        request.META['REMOTE_ADDR'] = '127.0.0.1'
        request.META['HTTP_USER_AGENT'] = test_user_agent

        user_logged_out.send(sender=self.user.__class__, request=request, user=self.user)

        self.assertEqual(UserAuthHistory.objects.filter(user=self.user, is_login=False, is_logged_in=False).count(), 1)


class GetClientIpTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get_client_ip(self):
        request = self.factory.get('/')
        request.META['REMOTE_ADDR'] = '127.0.0.1'
        self.assertEqual(get_client_ip(request), '127.0.0.1')

        request.META['HTTP_X_FORWARDED_FOR'] = '192.168.0.113, 127.0.0.1'
        self.assertEqual(get_client_ip(request), '192.168.0.113')
