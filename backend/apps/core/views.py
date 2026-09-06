from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from .models import Notification, AuditLog


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'action', 'resource_type', 'resource_id', 'created_at', 'details']


class NotificationListView(generics.ListAPIView):
    """Liste les notifications de l'utilisateur connecté."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkReadView(generics.UpdateAPIView):
    """Marque une notification comme lue."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(is_read=True)


class AuditLogListView(generics.ListAPIView):
    """Liste le journal d'audit de l'entreprise de l'utilisateur connecté."""
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        company_id = self.request.user.memberships.filter(is_active=True).values_list('company_id', flat=True).first()
        if not company_id:
            return AuditLog.objects.none()
        return AuditLog.objects.filter(company_id=company_id)
