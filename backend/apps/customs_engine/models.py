import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class HSCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(_('Code SH'), max_length=20, unique=True, db_index=True)
    description = models.TextField(_('Description'))
    
    # Hierarchical fields
    section = models.CharField(max_length=10, blank=True)
    chapter = models.CharField(max_length=10, blank=True)
    heading = models.CharField(max_length=10, blank=True)
    
    # The TEC (Tarif Extérieur Commun) category in CEMAC (I, II, III, IV, V)
    tariff_category = models.CharField(max_length=5, blank=True)
    
    # Specific taxes flags (Excise, specific VAT, etc.)
    is_excise_applicable = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Code SH')
        verbose_name_plural = _('Codes SH')
        db_table = 'customs_hs_code'

    def __str__(self):
        return f"{self.code} - {self.description[:50]}"


class TaxComponent(models.Model):
    """
    Ex: 'Droit de Douane (DD)', 'TVA', 'Redevance Informatique (RDI)', 'Prélèvement Communautaire (CCI)'
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('Nom de la taxe'), max_length=100, unique=True)
    code = models.CharField(_('Code unique'), max_length=20, unique=True) # e.g., DD, TVA, RDI, CCI
    description = models.TextField(blank=True)
    
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _('Composante Fiscale')
        verbose_name_plural = _('Composantes Fiscales')
        db_table = 'customs_tax_component'

    def __str__(self):
        return f"{self.code} - {self.name}"


class RuleStatus(models.TextChoices):
    DRAFT = 'DRAFT', _('Brouillon')
    UNDER_REVIEW = 'UNDER_REVIEW', _('En révision')
    APPROVED = 'APPROVED', _('Approuvé (Attente validation expert)')
    ACTIVE = 'ACTIVE', _('Actif')
    RETIRED = 'RETIRED', _('Retiré')
    NEEDS_EXPERT_VALIDATION = 'NEEDS_EXPERT_VALIDATION', _('Nécessite Validation Expert')


class Rule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('Nom de la règle'), max_length=255)
    tax_component = models.ForeignKey(TaxComponent, on_delete=models.CASCADE, related_name='rules')
    
    # Priority for calculation order (e.g. CIF must be calculated before DD, DD before TVA)
    priority = models.IntegerField(default=100) 
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Règle de Calcul')
        verbose_name_plural = _('Règles de Calcul')
        db_table = 'customs_rule'
        ordering = ['priority']

    def __str__(self):
        return self.name


class LegalSource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_('Titre du document'), max_length=255)
    reference = models.CharField(_('Référence officielle'), max_length=100) # Loi de finances 2026, Article X
    issuing_body = models.CharField(_('Organisme émetteur'), max_length=100) # DGI, Douanes Camerounaises, CEMAC
    publication_date = models.DateField()
    url = models.URLField(blank=True, null=True)
    
    class Meta:
        verbose_name = _('Source Légale')
        verbose_name_plural = _('Sources Légales')
        db_table = 'customs_legal_source'

    def __str__(self):
        return f"{self.reference} - {self.title}"


class RuleVersion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE, related_name='versions')
    version_string = models.CharField(_('Version'), max_length=20) # e.g. 2026.1
    
    # Details of the calculation
    base_formula = models.TextField(_('Formule de base'), help_text="e.g. CIF * rate")
    default_rate = models.DecimalField(max_digits=7, decimal_places=4, null=True, blank=True) # e.g. 0.1925 for 19.25%
    fixed_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Conditions
    condition_expression = models.TextField(_('Expression de condition'), blank=True, help_text="e.g. tariff_category == 'I'")
    
    # Metadata for 2026 exactness
    legal_source = models.ForeignKey(LegalSource, on_delete=models.SET_NULL, null=True, blank=True)
    effective_from = models.DateTimeField()
    effective_to = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=30, choices=RuleStatus.choices, default=RuleStatus.DRAFT)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Version de Règle')
        verbose_name_plural = _('Versions de Règle')
        db_table = 'customs_rule_version'

    def __str__(self):
        return f"{self.rule.name} - v{self.version_string} ({self.get_status_display()})"
