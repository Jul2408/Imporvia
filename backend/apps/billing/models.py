import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.companies.models import Company

class Plan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('Nom du plan'), max_length=100)
    description = models.TextField(_('Description'), blank=True)
    price = models.DecimalField(_('Prix mensuel'), max_digits=10, decimal_places=2)
    features = models.JSONField(_('Fonctionnalités'), default=list)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _('Plan')
        verbose_name_plural = _('Plans')
        db_table = 'billing_plan'

    def __str__(self):
        return self.name

class SubscriptionStatus(models.TextChoices):
    ACTIVE = 'ACTIVE', _('Actif')
    CANCELED = 'CANCELED', _('Annulé')
    EXPIRED = 'EXPIRED', _('Expiré')
    PENDING = 'PENDING', _('En attente')

class Subscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=SubscriptionStatus.choices, default=SubscriptionStatus.PENDING)
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Abonnement')
        verbose_name_plural = _('Abonnements')
        db_table = 'billing_subscription'

    def __str__(self):
        return f"{self.company.name} - {self.plan.name} ({self.status})"

class PaymentStatus(models.TextChoices):
    SUCCESS = 'SUCCESS', _('Succès')
    FAILED = 'FAILED', _('Échoué')
    PENDING = 'PENDING', _('En attente')

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(_('Montant'), max_digits=12, decimal_places=2)
    currency = models.CharField(_('Devise'), max_length=10, default='XAF')
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    transaction_id = models.CharField(_('ID Transaction'), max_length=255, blank=True, null=True)
    payment_method = models.CharField(_('Méthode de paiement'), max_length=50, blank=True) # e.g. 'CINETPAY', 'ORANGE_MONEY'
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('Paiement')
        verbose_name_plural = _('Paiements')
        db_table = 'billing_payment'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.amount} {self.currency} - {self.status}"
