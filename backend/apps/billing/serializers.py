from rest_framework import serializers
from .models import Plan, Subscription, Payment

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'company', 'company_name', 'plan', 'plan_name', 'status', 'current_period_start', 'current_period_end', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='subscription.company.name', read_only=True)
    plan_name = serializers.CharField(source='subscription.plan.name', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'subscription', 'company_name', 'plan_name', 'amount', 'currency', 'status', 'transaction_id', 'payment_method', 'created_at']
