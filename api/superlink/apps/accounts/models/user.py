import uuid
from django.db import models as db
from django.contrib.auth.models import AbstractUser
from core.utils.upload_file import generate_upload_path
from core.utils.image_validators import image_file_extension_validator, image_file_size_validator


class User(AbstractUser):
    FOLDER_PREFIX = 'avatar_'
    UPLOAD_FOLDER_NAME = 'users_avatars'

    ROLE_SUPER_ADMIN = 'super_admin'
    ROLE_EMPLOYEE = 'employee'

    ROLE_CHOICES = [
        (ROLE_SUPER_ADMIN, 'Супер администратор'),
        (ROLE_EMPLOYEE, 'Сотрудник'),
    ]

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        permissions = []
        ordering = ['-date_joined']

    uuid = db.UUIDField(default=uuid.uuid4, editable=False)
    role = db.CharField(
        verbose_name='Роль',
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_EMPLOYEE
    )
    avatar = db.ImageField(
        verbose_name='Аватарка',
        help_text='Фото клиента',
        upload_to=generate_upload_path,
        null=True,
        blank=True,
        validators=[image_file_extension_validator, image_file_size_validator]
    )
    phone_number = db.CharField(
        verbose_name='Номер телефона',
        max_length=14,
        null=True,
        blank=True
    )
    location = db.CharField(
        verbose_name='Локация',
        max_length=255,
        null=True,
        blank=True
    )
    birth_date = db.DateTimeField(
        verbose_name='Дата рождения',
        null=True,
        blank=True
    )
    email = db.EmailField(
        verbose_name='Почта',
        null=True,
        blank=True
    )
    job_title = db.CharField(
        verbose_name='Должность',
        max_length=255,
        null=True,
        blank=True
    )

    @property
    def is_super_admin(self):
        return self.role == self.ROLE_SUPER_ADMIN

    @property
    def is_employee(self):
        return self.role == self.ROLE_EMPLOYEE
