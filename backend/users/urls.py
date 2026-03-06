from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import register, forgot_password, verify_code, reset_password

urlpatterns = [
    # Autenticación JWT
    path('login/', TokenObtainPairView.as_view(), name='login'),

    # Registro de usuario
    path('register/', register, name='register'),

    # Recuperación de contraseña
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('verify-code/', verify_code, name='verify_code'),
    path('reset-password/', reset_password, name='reset_password'),
]
