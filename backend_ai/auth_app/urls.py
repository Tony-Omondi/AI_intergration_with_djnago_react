from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet, SignupView, LoginView, GoogleLoginCallbackView,
    PasswordResetRequestView, PasswordResetConfirmView, ProfileView,
    ClothingItemViewSet, VerifyOTPView
)

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='events')
router.register(r'closet', ClothingItemViewSet, basename='closet')

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/callback/', GoogleLoginCallbackView.as_view(), name='google_callback'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('accounts/profile/', RedirectView.as_view(url='http://localhost:5173/frontend_ai/dashboard'), name='account_profile'),
    path('accounts/', include('allauth.socialaccount.urls')),
]