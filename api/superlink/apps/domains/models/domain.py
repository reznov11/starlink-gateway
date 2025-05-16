import string
import random
from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import BaseModel


class Domain(BaseModel):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Активный'
        NOT_ACTIVE = 'NOT_ACTIVE', 'Неактивный'

    partner = models.ForeignKey(
        'partners.Partner',
        on_delete=models.CASCADE,
        related_name="domains",
        verbose_name=_("Партнёр")
    )
    code = models.CharField(
        max_length=255,
        unique=True,
        editable=False,
        verbose_name=_("Код")
    )
    url = models.URLField(verbose_name=_("URL-адрес"))
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_ACTIVE,
        verbose_name=_("Статус")
    )

    class Meta:
        verbose_name = _("Домен")
        verbose_name_plural = _("Домены")
        db_table = "domains"

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self._generate_unique_code()
        super().save(*args, **kwargs)

    def _generate_unique_code(self):
        prefix = "IFRM"
        length = 6
        chars = string.ascii_uppercase + string.digits

        while True:
            random_code = ''.join(random.choices(chars, k=length))
            full_code = f"{prefix}-{random_code}"
            if not Domain.objects.filter(code=full_code).exists():
                return full_code

    def __str__(self):
        return f"{self.url} ({self.code})"
