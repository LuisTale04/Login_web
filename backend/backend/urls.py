from django.contrib import admin
from django.urls import path
from users.views import register
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register),
    path('api/login/', TokenObtainPairView.as_view()),
]
