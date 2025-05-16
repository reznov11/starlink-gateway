from ast import literal_eval
from pathlib import Path
import os
import sys
from datetime import timedelta
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / "envfile.env")
sys.path.insert(0, os.path.join(BASE_DIR, "apps"))

SECRET_KEY = os.getenv(
    'SECRET_KEY', '2y)+u5#6wr(!g!=xpj&pnfa8n-!_-xmri7+&#b&-@*p!-8j$si')

STATIC_URL = 'vtiger/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
)
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'staticfiles'),
)

MEDIA_URL = '/api/assets/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'assets')

DEBUG = literal_eval(os.getenv('DEBUG', 'False'))

# if not DEBUG:
#     __import__('pysqlite3')
#     sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', []).split(',')
CSRF_TRUSTED_ORIGINS = os.getenv('TRUSTED_HOSTS').split(',')
APPEND_SLASH = True
ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

LANGUAGE_CODE = 'ru'
LANGUAGE_SESSION_KEY = 'ru'
LANGUAGES = (
    ('ru', 'Русский'),
    ('ky', 'Кыргызча'),
    ('en', 'English'),
)

USE_I18N = True
USE_TZ = False
TIME_ZONE = 'Asia/Bishkek'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True

# Database
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASS = os.getenv('POSTGRES_PASSWORD')
POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')

# Admin actions allowed users
ALLOWED_USERS_ACTIONS = os.getenv('ALLOWED_USERS_ACTIONS', '').split(',')

# Creatio CRM
CREATIO_API = os.getenv('CREATIO_API', 'http://10.152.158.17:8078')  # Pre-prod API

INSTALLED_APPS = [
    'jazzmin',
    'apps.accounts',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'knox',
    'rangefilter',
    'apps.auth_history',
    'apps.authorize',
    'apps.proposal',
    'apps.domains',
    'apps.partners',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DB = {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': POSTGRES_DB,
    'USER': POSTGRES_USER,
    'PASSWORD': POSTGRES_PASS,
    'HOST': POSTGRES_HOST,
    'PORT': POSTGRES_PORT,
}

DATABASES = {
    'default': DB
}

AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
    )
}

ACCESS_TOKEN_LIFETIME = timedelta(hours=1) if DEBUG else timedelta(minutes=1)
REFRESH_TOKEN_LIFETIME = ACCESS_TOKEN_LIFETIME

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': ACCESS_TOKEN_LIFETIME,
    'REFRESH_TOKEN_LIFETIME': REFRESH_TOKEN_LIFETIME,
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

JSONSUIT_WIDGET_THEME = 'twilight'

# Admin settings
JAZZMIN_SETTINGS = {
    "site_logo": "icons/admin_logo.png",
    "show_ui_builder": False,
    "language_chooser": True,
    "copyright": "OJSC Bakai Bank",
    "welcome_sign": "BakaiKG VTiger Proposals CRM",
    "search_model": ["auth.User"],
    "use_google_fonts_cdn": True,
}

JAZZMIN_UI_TWEAKS = {
    "theme": "lumen",
    "copyright": "OJSC Bakai Bank"
}

# Logging
LOGGING_BASE = os.path.join(BASE_DIR, 'logs')

if not os.path.exists(LOGGING_BASE):
    os.makedirs(LOGGING_BASE)

IMAGES_MEGABYTES_LIMIT = float(os.getenv('IMAGES_MEGABYTES_LIMIT', 5.50))
VIDEOS_MEGABYTES_LIMIT = float(os.getenv('VIDEOS_MEGABYTES_LIMIT', 10.50))
DOCUMENTS_MEGABYTES_LIMIT = float(os.getenv('DOCUMENTS_MEGABYTES_LIMIT', 20.50))
IMAGE_ALLOWED_EXTENSIONS: list[str] = os.getenv('IMAGE_ALLOWED_EXTENSIONS', 'jpg').replace(' ', '').split(',')
VIDEO_ALLOWED_EXTENSIONS: list[str] = os.getenv('VIDEO_ALLOWED_EXTENSIONS', 'mp4').split(',')

# Authorize history settings
LOGIN_HISTORY_DELETE_OLD = literal_eval(os.getenv("DEBUG", "False"))
LOGIN_HISTORY_KEEP_DAYS = literal_eval(os.getenv("DEBUG", "1"))
LOGIN_HISTORY_KEEP_LAST = literal_eval(os.getenv("DEBUG", "0"))
