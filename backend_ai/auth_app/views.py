from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse
from rest_framework import generics, status, views, viewsets, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import UserSerializer, UserProfileSerializer, EventSerializer, ClothingItemSerializer
from .models import UserProfile, Event, ClothingItem
import logging
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count

logger = logging.getLogger(__name__)

# EventViewSet
class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]  # Add token authentication

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ClothingItemViewSet
class ClothingItemViewSet(viewsets.ModelViewSet):
    serializer_class = ClothingItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]  # Explicitly set token authentication

    def get_queryset(self):
        logger.info(f"User authenticated: {self.request.user.is_authenticated}")
        return ClothingItem.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        logger.info("Fetching closet items")
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        grouped_items = queryset.values('category').annotate(count=Count('id')).order_by('category')
        grouped_data = {item['category']: item['count'] for item in grouped_items}
        
        return Response({
            'items': serializer.data,
            'grouped': grouped_data
        })

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# SignupView
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'error': serializer.errors.get('email', serializer.errors)
        }, status=status.HTTP_400_BAD_REQUEST)

# LoginView
class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({
            'error': 'Please use POST to login with email and password.'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({
                'error': 'Email and password are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(email=email)
        if not users.exists():
            return Response({
                'error': 'Invalid email or password.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        user = users.first()
        user = authenticate(request, username=user.username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.profile.full_name,
                }
            }, status=status.HTTP_200_OK)
        return Response({
            'error': 'Invalid email or password.'
        }, status=status.HTTP_401_UNAUTHORIZED)

# GoogleLoginCallbackView
class GoogleLoginCallbackView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            if not hasattr(user, 'profile'):
                full_name = user.get_full_name() or user.email.split('@')[0]
                UserProfile.objects.create(user=user, full_name=full_name)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.profile.full_name,
                }
            }, status=status.HTTP_200_OK)
        return Response({
            'error': 'Authentication failed'
        }, status=status.HTTP_401_UNAUTHORIZED)

# PasswordResetRequestView
class PasswordResetRequestView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({
                'error': 'Email is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(email=email)
        if not users.exists():
            return Response({
                'message': 'If an account with this email exists, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)

        if users.count() > 1:
            logger.warning(f"Multiple users found with email {email}: {users.count()} users")

        user = users.first()

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        domain = 'localhost:5173'
        protocol = 'http'
        reset_url = f"{protocol}://{domain}/frontend_ai/reset-password/{uid}/{token}/"

        logger.info(f"Generated reset_url: {reset_url}")

        plain_message = (
            f"Hello,\n\n"
            f"You requested to reset your password for your ClosetAI account. "
            f"Click the link below to reset your password:\n\n"
            f"{reset_url}\n\n"
            f"If you did not request a password reset, please ignore this email.\n\n"
            f"Thanks,\nThe ClosetAI Team"
        )

        try:
            html_message = render_to_string('password_reset_email.html', {
                'user': user,
                'domain': domain,
                'protocol': protocol,
                'uid': uid,
                'token': token,
                'reset_url': reset_url,
            })
            logger.info(f"HTML message: {html_message}")
        except Exception as e:
            logger.error(f"Failed to render password reset email template: {str(e)}")
            html_message = None

        subject = 'Password Reset Request for ClosetAI'
        send_mail(
            subject,
            plain_message,
            'noreply@closetai.com',
            [user.email],
            html_message=html_message,
            fail_silently=False,
        )

        return Response({
            'message': 'If an account with this email exists, a password reset link has been sent.'
        }, status=status.HTTP_200_OK)

# PasswordResetConfirmView
class PasswordResetConfirmView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')

            if not new_password or not confirm_password:
                return Response({
                    'error': 'New password and confirmation are required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if new_password != confirm_password:
                return Response({
                    'error': 'Passwords do not match.'
                }, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({
                'message': 'Password has been reset successfully.'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid or expired reset link.'
            }, status=status.HTTP_400_BAD_REQUEST)

# ProfileView
class ProfileView(views.APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]  # Add token authentication

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        user = request.user
        profile = user.profile
        logger.info(f"Received profile update request: {request.data}")
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Profile updated successfully: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(f"Profile update failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)