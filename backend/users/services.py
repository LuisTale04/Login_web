from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

from .models import PasswordResetCode


def create_user(validated_data):
    """
    Servicio para crear un nuevo usuario.
    Retorna el usuario creado.
    """
    user = User.objects.create_user(
        username=validated_data['username'],
        email=validated_data['email'],
        password=validated_data['password'],
        first_name=validated_data.get('first_name', ''),
    )
    return user


def generate_and_send_reset_code(email):
    """
    Genera un código de recuperación, lo guarda en la BD
    y lo envía por correo electrónico al usuario.
    Retorna True si se envió correctamente, False en caso contrario.
    """
    try:
        user = User.objects.get(email=email)

        # Invalidar códigos anteriores del usuario
        PasswordResetCode.objects.filter(
            user=user,
            is_used=False
        ).update(is_used=True)

        # Generar nuevo código
        code = PasswordResetCode.generate_code()
        PasswordResetCode.objects.create(user=user, code=code)

        # Enviar correo electrónico
        subject = 'BRIAROS POS - Código de Recuperación'
        message = (
            f'Hola {user.first_name or user.username},\n\n'
            f'Tu código de recuperación es: {code}\n\n'
            f'Este código expira en 15 minutos.\n\n'
            f'Si no solicitaste este código, ignora este mensaje.\n\n'
            f'— Equipo BRIAROS POS'
        )

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return True, code

    except User.DoesNotExist:
        return False, None
    except Exception:
        return False, None


def verify_reset_code(email, code):
    """
    Verifica si un código de recuperación es válido.
    Retorna (True, reset_code) si es válido, (False, None) en caso contrario.
    """
    try:
        user = User.objects.get(email=email)
        reset_code = PasswordResetCode.objects.filter(
            user=user,
            code=code,
            is_used=False
        ).latest('created_at')

        if reset_code.is_valid:
            return True, reset_code

        return False, None

    except (User.DoesNotExist, PasswordResetCode.DoesNotExist):
        return False, None


def reset_user_password(email, code, new_password):
    """
    Restablece la contraseña del usuario tras verificar el código.
    Retorna True si se cambió correctamente, False en caso contrario.
    """
    is_valid, reset_code = verify_reset_code(email, code)

    if not is_valid:
        return False

    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()

        # Marcar el código como usado
        reset_code.is_used = True
        reset_code.save()

        return True

    except User.DoesNotExist:
        return False
