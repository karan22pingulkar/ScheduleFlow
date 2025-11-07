from django.urls import path
from .views import (
    PostListCreateView,
    PostDetailView,
    SchedulePostListCreateView,
    SchedulePostDetailView,
    PostLogListView
)

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    # ---- schedule URLs ----
    path('schedule/', SchedulePostListCreateView.as_view(),
         name='schedule-list-create'),
    path('schedule/<int:pk>/', SchedulePostDetailView.as_view(),
         name='schedule-detail'),
    path('logs/', PostLogListView.as_view()),

]
