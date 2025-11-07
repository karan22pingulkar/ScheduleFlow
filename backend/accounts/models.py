from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username


class SocialAccount(models.Model):
    PLATFORM_CHOICES = (
        ("instagram", "Instagram"),
        ("linkedin", "LinkedIn"),
        ("twitter", "Twitter"),
        ("facebook", "Facebook"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    access_token = models.TextField()
    username = models.CharField(max_length=200)
    account_id = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.platform}"
