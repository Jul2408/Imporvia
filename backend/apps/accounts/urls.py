from django.urls import path
from .views import RegisterView, UserMeView, LogoutView, ChangePasswordView, CustomTokenObtainPairView, CustomTokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/refresh/', CustomTokenRefreshView.as_view(), name='auth_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    path('users/me/', UserMeView.as_view(), name='user_me'),
]
