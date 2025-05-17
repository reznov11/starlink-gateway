from django.db import models
import uuid
from django.utils.translation import gettext_lazy as _
from core.models import BaseModel


class Partner(BaseModel):
    name = models.CharField(max_length=255, verbose_name=_("Название компании"))
    login = models.CharField(max_length=255, verbose_name=_("Логин"), null=True, blank=True)
    phone_number = models.CharField(max_length=255, verbose_name=_("Номер телефона"), null=True, blank=True)
    email = models.EmailField(verbose_name=_("Электронная почта"), null=True, blank=True)
    logo = models.ImageField(upload_to="partner_logos/", null=True, blank=True, verbose_name=_("Логотип"))
    person_contact = models.CharField(max_length=255, verbose_name=_("Контактное лицо"))
    category = models.CharField(max_length=255, verbose_name=_("Категория"))
    inn = models.CharField(max_length=14, verbose_name=_("ИНН"))
    is_active = models.BooleanField(default=True, verbose_name=_("Активен"))
    domain = models.ForeignKey(
        to="domains.Domain", 
        on_delete=models.SET_NULL, 
        verbose_name=_("Домен"),
        related_name="partner_domain",
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = _("Партнёр")
        verbose_name_plural = _("Партнёры")
        db_table = "partners"

    def __str__(self):
        return self.name
