from django.contrib import admin
from .models import PasswordResetCode


@admin.register(PasswordResetCode)
class PasswordResetCodeAdmin(admin.ModelAdmin):
    """Configuración del panel admin para los códigos de recuperación."""
    list_display = ('user', 'code', 'created_at', 'is_used', 'is_expired')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__username', 'user__email', 'code')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
