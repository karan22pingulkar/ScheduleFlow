from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.core.cache import cache


def health_check(request):
    # 🔥 This touches Upstash Redis
    cache.set("uptime_ping", "alive", 300)

    return JsonResponse({
        "status": "ok",
        "redis": "touched"
    })
