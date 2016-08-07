
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 

DEBUG = True

ALLOWED_HOSTS = ['*']


ADMINS = []
INSTALLED_APPS = (
    'grappelli',
    'customauth',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'drealtime',    
    'ordenes',
    'productos',
    'licoreras',
    'rest_framework', 
    'corsheaders',
    'social.apps.django_app.default',
    'django_mobile',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'drealtime.middleware.iShoutCookieMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django_mobile.middleware.MobileDetectionMiddleware',
    'django_mobile.middleware.SetFlavourMiddleware',

)

ROOT_URLCONF = 'ebrios.urls'
GRAPPELLI_ADMIN_TITLE = 'ebrios'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django_mobile.context_processors.flavour',
                'social.apps.django_app.context_processors.backends',
                'social.apps.django_app.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'ebrios.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

AUTH_USER_MODEL = 'customauth.CustomUser'

LANGUAGE_CODE = 'es-co'

TIME_ZONE = 'America/Lima'

USE_I18N = True

USE_L10N = True

USE_TZ = True

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        #'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
        #'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.AllowAny',        
    ],
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',)
}


STATIC_URL = '/static/'
#EXTERNO
STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), "static_in_env", "static_root")
#FUNCIONAL
#STATIC_ROOT = os.path.join(BASE_DIR, "static_in_pro", "static_root")
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "", ""),
)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), "static_in_env", "media_root")
CORS_ORIGIN_ALLOW_ALL= True
#HABER QUE PASA
#AUTHENTICATION_BACKENDS = ['django-dual-authentication.backends.DualAuthentication']
AUTHENTICATION_BACKENDS = (
    'social.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend',
    )
SOCIAL_AUTH_FACEBOOK_KEY = 
SOCIAL_AUTH_FACEBOOK_SECRET = 
SOCIAL_AUTH_LOGIN_REDIRECT_URL = 
SOCIAL_AUTH_USER_MODEL = 
SOCIAL_AUTH_FACEBOOK_SCOPE = []
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    'fields': 'id, name, email, age_range',
}
SOCIAL_AUTH_FACEBOOK_EXTRA_DATA = ['first_name', 'last_name']
#SOCIAL_AUTH_USER_FIELDS = ['email','name']
#SOCIAL_AUTH_FACEBOOK_OAUTH2_WHITELISTED_DOMAINS=['127.0.0.1:8000']

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',    
    #'social.pipeline.user.get_username',   
    'social.pipeline.mail.mail_validation',
    #'social.pipeline.user.create_user',
    'customauth.pipeline.get_username',
    'customauth.pipeline.create_user',         
    'social.pipeline.social_auth.associate_user',
    #'social.pipeline.debug.debug',
    'social.pipeline.social_auth.load_extra_data',
    #'social.pipeline.user.user_details',
    'customauth.pipeline.user_details'
    #'social.pipeline.debug.debug'
)

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
if DEBUG:
    EMAIL_HOST = 'localhost'
    EMAIL_PORT = 1025
    EMAIL_HOST_USER = ''
    EMAIL_HOST_PASSWORD = ''
    EMAIL_USE_TLS = False
    DEFAULT_FROM_EMAIL = 'testing@example.com'


