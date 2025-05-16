import os
import datetime
from typing import Any
from django.utils.crypto import get_random_string


def custom_file_upload(instance: Any, filename: str, prefix: str, folder_name: str) -> str:
    today = datetime.date.today()
    random_string = get_random_string(20)
    name, extension = os.path.splitext(filename)
    new_filename = f'{prefix}{random_string}{extension}'
    folder_path = os.path.join(folder_name, str(today.year), str(today.month), str(today.day))
    return os.path.join(folder_path, new_filename)


def generate_upload_path(instance: Any, filename: str,) -> str:
    folder_prefix: str = instance.__class__.FOLDER_PREFIX or 'img_'
    folder_name: str = instance.__class__.UPLOAD_FOLDER_NAME or 'r_images'
    return custom_file_upload(instance, filename, prefix=folder_prefix, folder_name=folder_name)
