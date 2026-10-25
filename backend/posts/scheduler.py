"""
Lightweight in-process scheduler.

Replaces Celery + Redis for the POC: a daemon thread wakes every
POLL_SECONDS, claims due ScheduledPosts atomically, marks them
success/failed and writes a PostLog — the same behaviour as the
old posts.tasks.publish_scheduled_posts task, with no broker needed.
"""
import logging
import threading
import time

from django.db import close_old_connections
from django.utils import timezone

logger = logging.getLogger(__name__)

POLL_SECONDS = 30
_started = False


def _publish_due_posts():
    # imported here to avoid app-loading issues
    from .models import ScheduledPost, PostLog

    due_ids = list(
        ScheduledPost.objects.filter(
            status="pending", scheduled_time__lte=timezone.now()
        ).values_list("id", flat=True)
    )

    for sp_id in due_ids:
        try:
            # atomic claim: only one worker/thread can flip pending -> success
            claimed = ScheduledPost.objects.filter(
                pk=sp_id, status="pending"
            ).update(status="success")
            if not claimed:
                continue

            PostLog.objects.create(
                scheduled_post_id=sp_id,
                message="Post published successfully",
            )
            logger.info("ScheduledPost %s published", sp_id)
        except Exception as e:  # noqa: BLE001
            ScheduledPost.objects.filter(pk=sp_id).update(status="failed")
            PostLog.objects.create(
                scheduled_post_id=sp_id,
                message=f"Error: {e}",
            )
            logger.exception("ScheduledPost %s failed", sp_id)


def _loop():
    # let migrations/startup finish before the first poll
    time.sleep(15)
    while True:
        try:
            close_old_connections()
            _publish_due_posts()
        except Exception:  # noqa: BLE001
            logger.exception("scheduler tick failed")
        time.sleep(POLL_SECONDS)


def start():
    """Start the scheduler thread once per process."""
    global _started
    if _started:
        return
    _started = True

    thread = threading.Thread(target=_loop, name="post-scheduler", daemon=True)
    thread.start()
    logger.info("In-process post scheduler started (every %ss)", POLL_SECONDS)
