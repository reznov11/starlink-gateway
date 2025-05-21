from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import BaseModel


class Constructor(BaseModel):
    title = models.CharField(max_length=255, verbose_name=_("Название"))
    partner = models.ForeignKey(
        'partners.Partner',
        on_delete=models.SET_NULL,
        related_name="constructors",
        verbose_name=_("Партнёр"),
        null=True
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        related_name="constructors",
        verbose_name=_("Пользователь"),
        null=True
    )
    components_total = models.IntegerField(default=0, verbose_name=_("Количество компонентов"))
    components = models.JSONField(default=list, verbose_name=_("Компоненты"))
    settings = models.JSONField(default=dict, verbose_name=_("Настройки"))

    class Meta:
        verbose_name = _("Конструктор")
        verbose_name_plural = _("Конструкторы")
        db_table = "constructors"

    def __str__(self):
        return self.title
