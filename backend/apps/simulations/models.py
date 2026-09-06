import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class SimulationStatus(models.TextChoices):
    DRAFT = 'DRAFT', _('Brouillon')
    PROCESSING = 'PROCESSING', _('En cours')
    COMPLETED = 'COMPLETED', _('Terminé')
    FAILED = 'FAILED', _('Échoué')
    ARCHIVED = 'ARCHIVED', _('Archivé')

class Simulation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(_('Référence'), max_length=100, unique=True)
    
    # Multi-tenancy & Audit
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='simulations')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='simulations_created')
    
    status = models.CharField(max_length=20, choices=SimulationStatus.choices, default=SimulationStatus.DRAFT)
    
    # Inputs basics
    cif_value = models.DecimalField(_('Valeur CIF'), max_digits=15, decimal_places=2, null=True, blank=True)
    fob_value = models.DecimalField(_('Valeur FOB'), max_digits=15, decimal_places=2, null=True, blank=True)
    freight = models.DecimalField(_('Fret'), max_digits=15, decimal_places=2, null=True, blank=True)
    insurance = models.DecimalField(_('Assurance'), max_digits=15, decimal_places=2, null=True, blank=True)
    
    # Link to HS Code
    hs_code = models.ForeignKey('customs_engine.HSCode', on_delete=models.PROTECT, related_name='simulations', null=True)
    
    # Results
    total_taxes = models.DecimalField(_('Total Taxes'), max_digits=15, decimal_places=2, null=True, blank=True)
    total_to_pay = models.DecimalField(_('Total à Payer'), max_digits=15, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Simulation')
        verbose_name_plural = _('Simulations')
        db_table = 'simulations_simulation'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.reference} - {self.status}"

class CalculationSnapshot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    simulation = models.OneToOneField(Simulation, on_delete=models.CASCADE, related_name='snapshot')
    
    # Full JSON dump of the breakdown to freeze history
    engine_version = models.CharField(max_length=50, default="1.0.0")
    rules_version_stamp = models.CharField(max_length=100) # e.g. "LF2026_CEMAC"
    breakdown_payload = models.JSONField(_('Détail du calcul gelé'))
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('Instantané de Calcul')
        verbose_name_plural = _('Instantanés de Calcul')
        db_table = 'simulations_snapshot'
