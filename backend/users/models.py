import random
import string
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class PasswordResetCode(models.Model):
    """
    Modelo para almacenar códigos de recuperación de contraseña.
    Cada código tiene una expiración de 15 minutos.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reset_codes',
        verbose_name='Usuario'
    )
    code = models.CharField(max_length=6, verbose_name='Código')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    is_used = models.BooleanField(default=False, verbose_name='Usado')

    class Meta:
        verbose_name = 'Código de Recuperación'
        verbose_name_plural = 'Códigos de Recuperación'
        ordering = ['-created_at']

    def __str__(self):
        return f"Código para {self.user.username} - {'Usado' if self.is_used else 'Activo'}"

    @property
    def is_expired(self):
        """Verifica si el código ha expirado (15 minutos)."""
        return timezone.now() > self.created_at + timedelta(minutes=15)

    @property
    def is_valid(self):
        """Verifica si el código es válido (no usado y no expirado)."""
        return not self.is_used and not self.is_expired

    @staticmethod
    def generate_code():
        """Genera un código aleatorio de 6 dígitos."""
        return ''.join(random.choices(string.digits, k=6))
