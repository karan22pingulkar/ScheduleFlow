from celery import shared_task
from django.utils import timezone
from django.db import transaction
from .models import ScheduledPost, PostLog


@shared_task
def publish_scheduled_posts():
    now = timezone.now()
    scheduled_posts = ScheduledPost.objects.filter(
        status="pending", scheduled_time__lte=now)

    for sp in scheduled_posts:
        try:
            with transaction.atomic():
                # Mark as published
                sp.status = "success"
                sp.save()

                # Create success log
                PostLog.objects.create(
                    scheduled_post=sp,
                    message="Post published successfully"
                )
        except Exception as e:
            sp.status = "failed"
            sp.save()

            PostLog.objects.create(
                scheduled_post=sp,
                message=f"Error: {str(e)}"
            )
