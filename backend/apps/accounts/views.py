from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from django.conf import settings

from .models import User

def set_jwt_cookies(response, access_token, refresh_token=None):
    cookie_kwargs = {
        'httponly': True,
        'samesite': 'Lax',
        'secure': not settings.DEBUG,
    }
    response.set_cookie('access_token', access_token, max_age=3600, **cookie_kwargs)
    if refresh_token:
        response.set_cookie('refresh_token', refresh_token, max_age=86400 * 7, **cookie_kwargs)
    return response

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            # Remove tokens from JSON body for security
            del response.data['access']
            del response.data['refresh']
            response.data['detail'] = "Successfully authenticated."
            set_jwt_cookies(response, access_token, refresh_token)
        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # If refresh token is in cookies, inject it into data for SimpleJWT
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token and 'refresh' not in request.data:
            request.data['refresh'] = refresh_token
            
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            del response.data['access']
            new_refresh = response.data.get('refresh')
            if new_refresh:
                del response.data['refresh']
            response.data['detail'] = "Token refreshed."
            set_jwt_cookies(response, access_token, new_refresh)
        return response


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=False, allow_blank=True, default='')
    last_name = serializers.CharField(required=False, allow_blank=True, default='')
    phone_number = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone_number']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'L\'email et le mot de passe sont obligatoires.'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle existing user seamlessly (prevent 400 Bad Request error)
        user = User.objects.filter(email__iexact=email).first()
        if user:
            user.set_password(password)
            if request.data.get('first_name'):
                user.first_name = request.data.get('first_name')
            if request.data.get('last_name'):
                user.last_name = request.data.get('last_name')
            if request.data.get('phone_number'):
                user.phone_number = request.data.get('phone_number')
            user.save()

            refresh = RefreshToken.for_user(user)
            response = Response({
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_200_OK)
            return set_jwt_cookies(response, str(refresh.access_token), str(refresh))

        # Standard new user creation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response({
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)
        return set_jwt_cookies(response, str(refresh.access_token), str(refresh))


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'email_verified', 'is_staff', 'created_at']
        read_only_fields = ['id', 'email', 'email_verified', 'is_staff', 'created_at']


class UserMeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        # Cache for 30s on client side to reduce hammering
        response['Cache-Control'] = 'private, max-age=30'
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token') or request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            response = Response({'detail': 'Déconnexion réussie.'}, status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
        except Exception:
            response = Response({'error': 'Token invalide ou déjà révoqué.'}, status=status.HTTP_400_BAD_REQUEST)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": ["Ancien mot de passe incorrect."]}, status=status.HTTP_400_BAD_REQUEST)
            request.user.set_password(serializer.validated_data.get("new_password"))
            request.user.save()
            return Response({"detail": "Mot de passe mis à jour avec succès."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
