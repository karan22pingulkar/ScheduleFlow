from django.db import models
from django.contrib.auth.models import User
from accounts.models import SocialAccount
from cloudinary.models import CloudinaryField


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    caption = models.TextField()
    # image = models.FileField(upload_to="posts/", null=True, blank=True)
    image = CloudinaryField('image', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post by {self.user.username}"


class ScheduledPost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    account = models.ForeignKey(SocialAccount, on_delete=models.CASCADE)
    scheduled_time = models.DateTimeField()
    # pending/success/failed
    status = models.CharField(max_length=20, default="pending")

    def __str__(self):
        return f"Schedule for {self.account.username} at {self.scheduled_time}"


class PostLog(models.Model):
    scheduled_post = models.ForeignKey(ScheduledPost, on_delete=models.CASCADE)
    log_time = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    def __str__(self):
        return f"Log for {self.scheduled_post.id}"
