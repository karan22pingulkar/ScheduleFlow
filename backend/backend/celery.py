from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
from decouple import config
import ssl

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
app.conf.timezone = settings.TIME_ZONE
app.conf.enable_utc = False  # disable UTC mode (optional)
app.autodiscover_tasks()

# Optional: Upstash Redis SSL options if using rediss://
CELERY_BROKER_URL = config("UPSTASH_REDIS_URL")
CELERY_RESULT_BACKEND = config("UPSTASH_REDIS_URL")

app.conf.broker_url = CELERY_BROKER_URL
app.conf.result_backend = CELERY_RESULT_BACKEND
app.conf.broker_use_ssl = {'ssl_cert_reqs': ssl.CERT_NONE}  # or CERT_REQUIRED
app.conf.redis_backend_use_ssl = {
    'ssl_cert_reqs': ssl.CERT_NONE}  # or CERT_REQUIRED
