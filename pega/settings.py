"""
Django settings for pega project.

Generated by 'django-admin startproject' using Django 2.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY", "mTMhZsVDjurGMIIswFuMKjxiBjomVaFEddqLmpCk")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG", True)
if DEBUG == 'False':
    DEBUG = False
else:
    DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.forms',
]

# Put your third-party apps here
THIRD_PARTY_APPS = [
    'allauth',  # allauth account/registration management
    'allauth.account',

    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    'rest_framework',
    'celery_progress',

    # stripe integration
    'djstripe',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],
}

PEGASUS_APPS = [
    'pegasus.apps.examples.apps.PegasusExamplesConfig',
]

# Put your project-specific apps here
PROJECT_APPS = [
    'apps.subscriptions.apps.SubscriptionConfig',
    'apps.users.apps.UserConfig',
    'apps.web',
    'project',
]

TWO_FACTOR_AUTHENTICATION = [
    # 'django_otp',
    # 'django_otp.plugins.otp_static',
    # 'django_otp.plugins.otp_totp',
    # 'two_factor',
    # 'otp_yubikey',
]

SWAGGER_APPS = [
    'rest_framework_swagger',
    'drf_yasg',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + PEGASUS_APPS + PROJECT_APPS + SWAGGER_APPS + TWO_FACTOR_AUTHENTICATION

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'django_otp.middleware.OTPMiddleware',
    # 'two_factor.middleware.threadlocals.ThreadLocals',
]

ROOT_URLCONF = 'pega.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'apps.web.context_processors.project_meta',
                 # this line can be removed if not using google analytics
                'apps.web.context_processors.google_analytics_id',
            ],
        },
    },
]

WSGI_APPLICATION = 'pega.wsgi.application'

FORM_RENDERER = 'django.forms.renderers.TemplatesSetting'

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER': os.environ.get('DATABASE_USERNAME'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
        'HOST': os.environ.get('DATABASE_HOST'),
        'PORT': '5432',
    }
}



# Auth / login stuff

# Django recommends overriding the user model even if you don't think you need to because it makes
# future changes much easier.
AUTH_USER_MODEL = 'users.CustomUser'
LOGIN_REDIRECT_URL = '/'
# LOGIN_URL = 'two_factor:login'

# this one is optional
# LOGIN_REDIRECT_URL = 'two_factor:profile'
# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

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

# Allauth setup

ACCOUNT_ADAPTER = 'apps.users.adapter.EmailAsUsernameAdapter'
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_SESSION_REMEMBER = True
ACCOUNT_LOGOUT_ON_GET = True
# TWO_FACTOR_SMS_GATEWAY = 'two_factor.gateways.twilio.gateway.Twilio'
# TWO_FACTOR_CALL_GATEWAY = 'two_factor.gateways.twilio.gateway.Twilio'
# TWILIO_ACCOUNT_SID =
# TWILIO_AUTH_TOKEN =
# TWILIO_CALLER_ID =


# User signup configuration: change to "mandatory" to require users to confirm email before signing in.
# or "optional" to send confirmation emails but not require them
ACCOUNT_EMAIL_VERIFICATION = 'none'


AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
)


# enable social login
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
# uncomment to use manifest storage to bust cache when file change
# note: this may break some image references in sass files which is why it is not enabled by default
# STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Email setup

# use in development
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# use in production
# see https://github.com/anymail/django-anymail for more details/examples
# EMAIL_BACKEND = 'anymail.backends.mailgun.EmailBackend'
# ANYMAIL = {
#     "MAILGUN_API_KEY": os.environ.get('MAILGUN_API_KEY'),
#     "MAILGUN_SENDER_DOMAIN": os.environ.get('SITE_DOMAIN'),
#     'MAILGUN_API_URL': 'https://api.eu.mailgun.net/v3',
# }

# SERVER_EMAIL = os.environ.get('SERVER_EMAIL')
# DEFAULT_FROM_EMAIL = os.environ.get('SERVER_EMAIL')
# ADMINS = [(os.environ.get('USER_EMAIL'), os.environ.get('REPLY')),]


# EMAIL_HOST = 'smtp.mailgun.org'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = os.environ.get('SERVER_EMAIL')
# EMAIL_HOST_PASSWORD = '17f182638111cac40e82c7800fa7e036-4de08e90-978dec83'
# EMAIL_USE_TLS = True
# DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'TestSite Team <noreply@example.com>')
EMAIL_FILE_PATH = os.path.join(BASE_DIR, "sent_emails")
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('SMTP_HOSTNAME')
SMTP_USER = os.environ.get('SMTP_USER')
EMAIL_HOST_USER = SMTP_USER
EMAIL_HOST_PASSWORD = os.environ.get('SMTP_PASSWORD')
EMAIL_USE_TLS = True
EMAIL_PORT = 587
SMTP_FROM_NAME = os.environ.get('SMTP_FROM_NAME')
DEFAULT_FROM_EMAIL = '%s <%s>' % (SMTP_FROM_NAME, SMTP_USER)
SMTP_REPLY_TO = os.environ.get('SMTP_REPLY_TO')

# Settings for mailist

MAILERLIST_API_KEY = os.environ.get('MAILERLITE_TOKEN')
MAILERLIST_GROUP_ID = os.environ.get('MAILERLITE_GROUPID')


# Django sites

SITE_ID = 1

# DRF config
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}


# Celery setup (using redis)
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
CELERY_TIMEZONE = "Europe/London"
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60


# Pegasus config

# replace any values below with specifics for your project
PROJECT_METADATA = {
    'NAME': 'PEGA NAME | Obstract AI',
    'URL': 'https://sherlock-staging.obstractai.com',
    'DESCRIPTION': 'Obstract AI makes it easy to collect and parse cyber threat intelligence',
    'IMAGE': 'https://upload.wikimedia.org/wikipedia/commons/2/20/PEO-pegasus_black.svg',
    'KEYWORDS': 'security, rss',
    'CONTACT_EMAIL': os.environ.get('CONTACT_EMAIL'),
}


ADMINS = [('pega', 'postmaster@mg.obstractai.com')]

GOOGLE_ANALYTICS_ID = ''  # replace with your google analytics ID to connect to Google Analytics

# Stripe config

# modeled to be the same as https://github.com/dj-stripe/dj-stripe
STRIPE_LIVE_PUBLIC_KEY = os.environ.get("STRIPE_LIVE_PUBLIC_KEY")
STRIPE_LIVE_SECRET_KEY = os.environ.get("STRIPE_LIVE_SECRET_KEY")
STRIPE_TEST_PUBLIC_KEY = os.environ.get("STRIPE_TEST_PUBLIC_KEY")
STRIPE_TEST_SECRET_KEY = os.environ.get("STRIPE_TEST_SECRET_KEY")
STRIPE_LIVE_MODE = False  # Change to True in production

# Get it from the section in the Stripe dashboard where you added the webhook endpoint
# or from the stripe CLI when testing

DJSTRIPE_WEBHOOK_SECRET = os.environ.get("DJSTRIPE_WEBHOOK_SECRET")
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
USER_EMAIL = os.environ.get('USER_EMAIL')
FROM = os.environ.get('FROM')
REPLY = os.environ.get('REPLY')
SITE_ROOT_URL = os.environ.get('SITE_ROOT_URL')
SITE_DOMAIN = os.environ.get('SITE_DOMAIN')
