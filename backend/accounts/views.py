# from django.shortcuts import render
from .models import UserProfile, SocialAccount
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserProfileSerializer, SocialAccountSerializer
from django.contrib.auth.models import User


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if not serializer.is_valid():
        print(serializer.errors)  # <-- check what validation failed
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    self.perform_create(serializer)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


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
