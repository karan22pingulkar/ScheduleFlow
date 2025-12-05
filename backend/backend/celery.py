from __future__ import absolute_import, unicode_literals
import os
import ssl
from celery import Celery
from django.conf import settings
from decouple import config

# Set default Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

# Load settings with CELERY_ prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks from all apps
app.autodiscover_tasks()

# Timezone
app.conf.timezone = settings.TIME_ZONE
app.conf.enable_utc = False

# --- REDIS / UPSTASH SETTINGS ---
UPSTASH_REDIS_URL = config("UPSTASH_REDIS_URL")

app.conf.broker_url = UPSTASH_REDIS_URL
app.conf.result_backend = UPSTASH_REDIS_URL

# SSL REQUIRED for Upstash
app.conf.broker_use_ssl = {
    "ssl_cert_reqs": ssl.CERT_NONE
}

app.conf.redis_backend_use_ssl = {
    "ssl_cert_reqs": ssl.CERT_NONE
}

# Force Persistent Beat Scheduler (REQUIRED on Render)
app.conf.beat_scheduler = "celery.beat.PersistentScheduler"
