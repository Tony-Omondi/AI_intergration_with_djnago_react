from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, SignupView, LoginView, GoogleLoginCallbackView, PasswordResetRequestView, PasswordResetConfirmView, ProfileView

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='events')

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/callback/', GoogleLoginCallbackView.as_view(), name='google_callback'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('profile/', ProfileView.as_view(), name='profile'),
]