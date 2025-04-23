from django.urls import path
from .views import SignupView, LoginView, GoogleLoginCallbackView, PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/callback/', GoogleLoginCallbackView.as_view(), name='google_callback'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]