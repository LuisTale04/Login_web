from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para el registro de nuevos usuarios."""
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 4},
        }

    def validate_email(self, value):
        """Valida que el email no esté registrado."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value

    def validate_username(self, value):
        """Valida que el nombre de usuario no exista."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def create(self, validated_data):
        """Crea un nuevo usuario con la contraseña hasheada."""
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer para solicitar la recuperación de contraseña."""
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Verifica que el email exista en la base de datos."""
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No existe una cuenta asociada a este correo.")
        return value


class VerifyCodeSerializer(serializers.Serializer):
    """Serializer para verificar el código de recuperación."""
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True, max_length=6, min_length=6)


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer para restablecer la contraseña."""
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True, max_length=6, min_length=6)
    new_password = serializers.CharField(required=True, min_length=4)
    confirm_password = serializers.CharField(required=True, min_length=4)

    def validate(self, data):
        """Valida que ambas contraseñas coincidan."""
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Las contraseñas no coinciden."
            })
        return data
