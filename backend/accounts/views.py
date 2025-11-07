# from django.shortcuts import render
from .models import UserProfile, SocialAccount
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserProfileSerializer, SocialAccountSerializer
from django.contrib.auth.models import User


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user)
        return profile


class SocialAccountListCreateView(generics.ListCreateAPIView):
    serializer_class = SocialAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SocialAccount.objects.filter(user=self.request.user)


class SocialAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SocialAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SocialAccount.objects.filter(user=self.request.user)
