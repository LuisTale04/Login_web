from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import (
    RegisterSerializer,
    ForgotPasswordSerializer,
    VerifyCodeSerializer,
    ResetPasswordSerializer,
)
from .services import (
    generate_and_send_reset_code,
    verify_reset_code,
    reset_user_password,
)


@api_view(['POST'])
def register(request):
    """
    Endpoint para registrar un nuevo usuario.
    Recibe: username, first_name, email, password.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Usuario creado correctamente."},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def forgot_password(request):
    """
    Endpoint para solicitar la recuperación de contraseña.
    Recibe: email.
    Genera un código de 6 dígitos y lo envía por correo.
    """
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        success, code = generate_and_send_reset_code(email)

        if success:
            return Response(
                {"message": "Código de recuperación enviado al correo electrónico."},
                status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Error al enviar el correo. Intenta nuevamente."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_code(request):
    """
    Endpoint para verificar el código de recuperación.
    Recibe: email, code.
    """
    serializer = VerifyCodeSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        is_valid, _ = verify_reset_code(email, code)

        if is_valid:
            return Response(
                {"message": "Código verificado correctamente."},
                status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Código inválido o expirado."},
            status=status.HTTP_400_BAD_REQUEST
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reset_password(request):
    """
    Endpoint para restablecer la contraseña.
    Recibe: email, code, new_password, confirm_password.
    """
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']

        success = reset_user_password(email, code, new_password)

        if success:
            return Response(
                {"message": "Contraseña restablecida correctamente."},
                status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Código inválido o expirado."},
            status=status.HTTP_400_BAD_REQUEST
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
