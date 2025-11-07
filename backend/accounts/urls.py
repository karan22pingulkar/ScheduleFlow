from django.urls import path
from .views import RegisterView, UserProfileView, SocialAccountListCreateView, SocialAccountDetailView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('social-accounts/', SocialAccountListCreateView.as_view(),
         name='social-account-list'),
    path('social-accounts/<int:pk>/', SocialAccountDetailView.as_view(),
         name='social-account-detail'),
]
