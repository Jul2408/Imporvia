from rest_framework import serializers
from apps.accounts.models import User
from apps.companies.models import Company, Membership
from apps.simulations.models import Simulation
from apps.core.models import AuditLog, Notification

class UserAdminSerializer(serializers.ModelSerializer):
    company_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'is_active', 'email_verified', 'created_at', 'company_count']

    def get_company_count(self, obj):
        return obj.memberships.count()

class CompanyAdminSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    simulation_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'tax_id', 'address', 'is_active', 'created_at', 'member_count', 'simulation_count']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_simulation_count(self, obj):
        return obj.simulations.count()

class SimulationAdminSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = Simulation
        fields = ['id', 'reference', 'status', 'cif_value', 'total_taxes', 'total_to_pay', 'created_at', 'company_name', 'created_by_email']

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'action', 'resource_type', 'resource_id', 'ip_address', 'created_at', 'user_email', 'details']
