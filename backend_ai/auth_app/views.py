from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse
from rest_framework import generics, status, views, viewsets, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import UserSerializer, UserProfileSerializer, EventSerializer, ClothingItemSerializer, OTPSerializer
from .models import UserProfile, Event, ClothingItem, OTP
import logging
from django.db.models import Count
from django.utils import timezone

logger = logging.getLogger(__name__)

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ClothingItemViewSet(viewsets.ModelViewSet):
    serializer_class = ClothingItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

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

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            otp = OTP.objects.create(user=user, purpose='signup')
            plain_message = (
                f"Hello,\n\n"
                f"Thank you for signing up with ClosetAI. Your OTP for email verification is: {otp.code}\n\n"
                f"This OTP is valid for 10 minutes. Please enter it to verify your email.\n\n"
                f"Thanks,\nThe ClosetAI Team"
            )
            try:
                html_message = render_to_string('otp_email.html', {
                    'user': user,
                    'otp': otp.code,
                    'protocol': 'https' if request.is_secure() else 'http',
                    'domain': request.get_host(),
                })
            except Exception as e:
                logger.error(f"Failed to render OTP email template: {str(e)}")
                html_message = None

            send_mail(
                subject='ClosetAI Email Verification OTP',
                message=plain_message,
                from_email='noreply@closetai.com',
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            return Response({
                'message': 'User created. Please verify your email with the OTP sent.',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        code = request.data.get('code')
        purpose = request.data.get('purpose', 'signup')

        if not user_id or not code:
            return Response({
                'errors': 'User ID and OTP code are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            otp = OTP.objects.filter(user=user, code=code, purpose=purpose).latest('created_at')
            if not otp.is_valid():
                return Response({
                    'errors': 'OTP has expired or is invalid.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if purpose == 'signup':
                user.is_active = True
                user.save()
                token, created = Token.objects.get_or_create(user=user)
                # Ensure profile exists
                try:
                    full_name = user.profile.full_name
                except UserProfile.DoesNotExist:
                    UserProfile.objects.create(user=user, full_name=user.email.split('@')[0])
                    full_name = user.email.split('@')[0]
                return Response({
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'full_name': full_name,
                    }
                }, status=status.HTTP_200_OK)
            elif purpose == 'password_reset':
                return Response({
                    'message': 'OTP verified. You can now reset your password.',
                    'user_id': user.id
                }, status=status.HTTP_200_OK)
        except (User.DoesNotExist, OTP.DoesNotExist):
            return Response({
                'errors': 'Invalid user or OTP.'
            }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({
                'errors': 'Email and password are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user and user.is_active:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            # Handle missing profile
            try:
                full_name = user.profile.full_name
            except UserProfile.DoesNotExist:
                UserProfile.objects.create(user=user, full_name=email.split('@')[0])
                full_name = email.split('@')[0]
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': full_name,
                }
            }, status=status.HTTP_200_OK)
        return Response({
            'errors': 'Invalid email, password, or unverified account.'
        }, status=status.HTTP_401_UNAUTHORIZED)

class GoogleLoginCallbackView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            # Ensure profile exists
            try:
                full_name = user.profile.full_name
            except UserProfile.DoesNotExist:
                full_name = user.get_full_name() or user.email.split('@')[0]
                UserProfile.objects.create(user=user, full_name=full_name)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': full_name,
                }
            }, status=status.HTTP_200_OK)
        return Response({
            'errors': 'Authentication failed'
        }, status=status.HTTP_401_UNAUTHORIZED)

class PasswordResetRequestView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({
                'errors': 'Email is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(email=email)
        if not users.exists():
            return Response({
                'message': 'If an account with this email exists, an OTP has been sent.'
            }, status=status.HTTP_200_OK)

        user = users.first()
        otp = OTP.objects.create(user=user, purpose='password_reset')
        plain_message = (
            f"Hello,\n\n"
            f"You requested to reset your password for your ClosetAI account. Your OTP is: {otp.code}\n\n"
            f"This OTP is valid for 10 minutes. Please enter it to proceed with resetting your password.\n\n"
            f"If you did not request a password reset, please ignore this email.\n\n"
            f"Thanks,\nThe ClosetAI Team"
        )
        try:
            html_message = render_to_string('otp_email.html', {
                'user': user,
                'otp': otp.code,
                'protocol': 'https' if request.is_secure() else 'http',
                'domain': request.get_host(),
            })
        except Exception as e:
            logger.error(f"Failed to render OTP email template: {str(e)}")
            html_message = None

        send_mail(
            subject='ClosetAI Password Reset OTP',
            message=plain_message,
            from_email='noreply@closetai.com',
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return Response({
            'message': 'If an account with this email exists, an OTP has been sent.',
            'user_id': user.id
        }, status=status.HTTP_200_OK)

class PasswordResetConfirmView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not user_id or not new_password or not confirm_password:
            return Response({
                'errors': 'User ID, new password, and confirmation are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({
                'errors': 'Passwords do not match.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()
            OTP.objects.filter(user=user, purpose='password_reset').delete()
            return Response({
                'message': 'Password has been reset successfully.'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'errors': 'Invalid user.'
            }, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(views.APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

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