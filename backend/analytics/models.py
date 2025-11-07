from django.db import models
from posts.models import Post


class PostAnalytics(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE)
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)
    reach = models.IntegerField(default=0)

    fetched_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analytics for Post {self.post.id}"
