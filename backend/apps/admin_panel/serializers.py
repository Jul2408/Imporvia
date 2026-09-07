from rest_framework import serializers
from apps.accounts.models import User
from apps.companies.models import Company, Membership
from apps.simulations.models import Simulation
from apps.core.models import AuditLog, Notification
from apps.billing.models import Payment, Plan, Subscription


class UserAdminSerializer(serializers.ModelSerializer):
    company_count = serializers.SerializerMethodField()
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone_number',
            'is_active', 'is_staff', 'email_verified',
            'created_at', 'last_login', 'company_count', 'full_name'
        ]
        read_only_fields = ['id', 'created_at', 'last_login', 'email_verified']

    def get_company_count(self, obj):
        return obj.memberships.count()


class CompanyAdminSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(read_only=True, default=0)
    simulation_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'tax_id', 'address',
            'is_active', 'created_at', 'member_count', 'simulation_count'
        ]
        read_only_fields = ['id', 'created_at']


class SimulationAdminSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True, default='—')
    hs_code_display = serializers.SerializerMethodField()

    class Meta:
        model = Simulation
        fields = [
            'id', 'reference', 'status',
            'cif_value', 'fob_value', 'total_taxes', 'total_to_pay',
            'created_at', 'company_name', 'created_by_email', 'hs_code_display'
        ]

    def get_hs_code_display(self, obj):
        if obj.hs_code:
            return obj.hs_code.code
        return '—'


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True, default='Système')

    class Meta:
        model = AuditLog
        fields = [
            'id', 'action', 'resource_type', 'resource_id',
            'ip_address', 'created_at', 'user_email', 'details'
        ]


class NotificationAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at', 'user_email']
        read_only_fields = ['id', 'created_at', 'is_read']


class PaymentAdminSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='subscription.company.name', read_only=True)
    plan_name = serializers.CharField(source='subscription.plan.name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'currency', 'status',
            'transaction_id', 'created_at',
            'company_name', 'plan_name'
        ]
