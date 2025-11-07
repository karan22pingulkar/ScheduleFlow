from rest_framework import serializers
from .models import PostAnalytics


class PostAnalyticsSerializer(serializers.ModelSerializer):
    post = serializers.ReadOnlyField(source='post.id')  # show post ID only

    class Meta:
        model = PostAnalytics
        fields = ['id', 'post', 'likes', 'comments',
                  'impressions', 'reach', 'fetched_at']
        read_only_fields = ['id', 'post', 'fetched_at']
