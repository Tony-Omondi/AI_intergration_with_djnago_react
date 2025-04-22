from django.urls import path
from .views import SignupView, LoginView, GoogleLoginCallbackView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/callback/', GoogleLoginCallbackView.as_view(), name='google_callback'),
]