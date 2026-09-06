from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from .models import Company, Membership, Role


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'tax_id', 'address', 'is_active', 'created_at']
        read_only_fields = ['id', 'is_active', 'created_at']


class MembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = ['id', 'user', 'user_email', 'user_full_name', 'role', 'joined_at', 'is_active']
        read_only_fields = ['id', 'joined_at', 'user']

    def get_user_full_name(self, obj):
        return obj.user.full_name


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(members__user=self.request.user, members__is_active=True)

    def perform_create(self, serializer):
        company = serializer.save()
        # Le créateur devient automatiquement OWNER
        Membership.objects.create(
            user=self.request.user,
            company=company,
            role=Role.OWNER,
            is_active=True
        )


class MembershipViewSet(viewsets.ModelViewSet):
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Récupère les membres de l'entreprise active de l'utilisateur connecté
        company_id = self.kwargs.get('company_pk')
        return Membership.objects.filter(
            company_id=company_id,
            company__members__user=self.request.user
        )
