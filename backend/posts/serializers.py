from rest_framework import serializers
from .models import Post, ScheduledPost, PostLog
from django.utils import timezone


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    # ensures frontend gets full Cloudinary URL
    # image = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'caption', 'image',
                  'created_at', 'updated_at', 'username']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        # Assign logged-in user automatically
        validated_data['user'] = request.user
        return super().create(validated_data)

    def to_representation(self, instance):
        """Ensure frontend gets full Cloudinary URL"""
        rep = super().to_representation(instance)
        if instance.image:
            try:
                rep['image'] = instance.image.url
            except:
                rep['image'] = None
        else:
            rep['image'] = None
        return rep


class ScheduledPostSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = ScheduledPost
        fields = ['id', 'post', 'account', 'scheduled_time', 'status']
        read_only_fields = ['id', 'status']    # status updated by system later

    def get_post(self, obj):
        return {
            "id": obj.post.id,
            "caption": obj.post.caption,
            "image": obj.post.image.url if obj.post.image else None
        }

    def validate(self, data):
        """
        ✅ Ensure scheduled time is future
        ✅ Ensure post belongs to requesting user
        """
        request = self.context.get('request')

        if data['scheduled_time'] <= timezone.now():
            raise serializers.ValidationError(
                "Scheduled time must be in the future.")

        if data['post'].user != request.user:
            raise serializers.ValidationError(
                "You can only schedule your own posts.")

        return data


# --------- POST LOG SERIALIZER (Read-only) ----------
class PostLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLog
        fields = ['id', 'scheduled_post', 'log_time', 'message']
        read_only_fields = ['id', 'scheduled_post', 'log_time', 'message']
