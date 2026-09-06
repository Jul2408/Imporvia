import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('nom de l\'entreprise'), max_length=255)
    tax_id = models.CharField(_('numéro d\'identification fiscale (NIU)'), max_length=50, blank=True)
    address = models.TextField(_('adresse'), blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('entreprise')
        verbose_name_plural = _('entreprises')
        db_table = 'companies_company'
        
    def __str__(self):
        return self.name

class Role(models.TextChoices):
    OWNER = 'OWNER', _('Propriétaire')
    ADMIN = 'ADMIN', _('Administrateur')
    MANAGER = 'MANAGER', _('Manager')
    EMPLOYEE = 'EMPLOYEE', _('Employé')
    VIEWER = 'VIEWER', _('Observateur')

class Membership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VIEWER)
    
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = _('membre')
        verbose_name_plural = _('membres')
        db_table = 'companies_membership'
        unique_together = ('user', 'company')
        
    def __str__(self):
        return f"{self.user.email} - {self.company.name} ({self.get_role_display()})"
