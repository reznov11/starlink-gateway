from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
from django.template.defaultfilters import filesizeformat
from django.core.validators import FileExtensionValidator


@deconstructible
class FileSizeValidator(object):
    error_messages = {
        'max_size': ("Убедитесь, что размер этого файла не превышает %(max_size)s." " Размер вашего файла %(size)s."),
        'min_size': ("Убедитесь, что размер этого файла больше %(min_size)s. " "Размер вашего файла %(size)s."),
        'content_type': "Файлы с форматом %(content_type)s не поддерживаются.",
    }

    def __init__(self, max_size=None, min_size=None, content_types=()):
        self.max_size = max_size
        self.min_size = min_size
        self.content_types = content_types

    def __call__(self, data):
        if self.max_size is not None and data.size > self.max_size:
            params = {
                'max_size': filesizeformat(self.max_size),
                'size': filesizeformat(data.size),
            }
            raise ValidationError(self.error_messages['max_size'], 'max_size', params)

        if self.min_size is not None and data.size < self.min_size:
            params = {
                'min_size': filesizeformat(self.min_size),
                'size': filesizeformat(data.size)
            }
            raise ValidationError(self.error_messages['min_size'], 'min_size', params)

    def __eq__(self, other):
        return (
            isinstance(other, FileSizeValidator) and
            self.max_size == other.max_size and
            self.min_size == other.min_size and
            self.content_types == other.content_types
        )


image_file_size_validator: FileSizeValidator = FileSizeValidator(
    max_size=settings.IMAGES_MEGABYTES_LIMIT * 1024 ** 2,
    content_types=('image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml', 'image/webp')
)

video_file_size_validator: FileSizeValidator = FileSizeValidator(
    max_size=settings.VIDEOS_MEGABYTES_LIMIT * 1024 ** 2,
    content_types=('video/mp4', 'video/webm', 'video/quicktime', 'application/json')
)

image_file_extension_validator: FileExtensionValidator = FileExtensionValidator(
    allowed_extensions=settings.IMAGE_ALLOWED_EXTENSIONS
)

video_file_extension_validator: FileExtensionValidator = FileExtensionValidator(
    allowed_extensions=settings.VIDEO_ALLOWED_EXTENSIONS
)
