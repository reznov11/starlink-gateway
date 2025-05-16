import uuid
from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    created_at = models.DateTimeField(
        verbose_name='Создано',
        default=timezone.now
    )
    updated_at = models.DateTimeField(
        verbose_name='Обновлено',
        auto_now=True
    )
    public_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        db_index=True
    )

    class Meta:
        abstract = True
