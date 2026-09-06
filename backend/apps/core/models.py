import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(_('Titre'), max_length=255)
    message = models.TextField(_('Message'))
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Notification')
        verbose_name_plural = _('Notifications')
        db_table = 'core_notification'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.title}"

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(_('Action'), max_length=100) # e.g. CREATED_SIMULATION, DELETED_USER
    resource_type = models.CharField(_('Type de ressource'), max_length=100) # e.g. Simulation, User
    resource_id = models.CharField(_('ID de la ressource'), max_length=255)
    details = models.JSONField(_('Détails'), blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Journal d\'Audit')
        verbose_name_plural = _('Journaux d\'Audit')
        db_table = 'core_audit_log'
        ordering = ['-created_at']

    def __str__(self):
        user_email = self.user.email if self.user else 'System'
        return f"{self.action} on {self.resource_type} by {user_email}"
