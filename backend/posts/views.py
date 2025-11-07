from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Post, ScheduledPost, PostLog
from .serializers import PostSerializer, ScheduledPostSerializer, PostLogSerializer
from rest_framework.permissions import IsAuthenticated


# ----- LIST + CREATE -----
class PostListCreateView(generics.ListCreateAPIView):
    # queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        # Return only posts of the logged-in user, most recent first
        return Post.objects.filter(user=self.request.user).order_by('-created_at')

    # ensure only authenticated user's post is created
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


# ----- RETRIEVE + UPDATE + DELETE -----
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ensure user can only edit/delete own posts
    def perform_update(self, serializer):
        if self.get_object().user != self.request.user:
            raise PermissionError("You can only edit your own posts")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionError("You can only delete your own posts")
        instance.delete()


# ----------- SCHEDULE POST (LIST + CREATE) ---------------
class SchedulePostListCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduledPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # show only logged-in user's scheduled posts
        return ScheduledPost.objects.filter(post__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


# ----------- SCHEDULE DETAIL (GET / UPDATE / DELETE) ------
class SchedulePostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ScheduledPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ensure user can only access own schedules
        return ScheduledPost.objects.filter(post__user=self.request.user)


class PostLogListView(generics.ListAPIView):
    queryset = PostLog.objects.all()
    serializer_class = PostLogSerializer
    permission_classes = [IsAuthenticated]
