from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from .models import HSCode, TaxComponent, LegalSource, Rule, RuleVersion, RuleStatus
from .services import CustomsCalculationService

class CustomsEngineTests(TestCase):
    def setUp(self):
        # 1. Setup Legal Source (2026)
        self.source = LegalSource.objects.create(
            title="Loi de Finances 2026 Cameroun",
            reference="LF2026",
            issuing_body="DGI & Douanes",
            publication_date="2025-12-15"
        )
        
        # 2. Setup HS Code (e.g., Laptops usually have category I or II in CEMAC, let's say I for 10% DD)
        self.hs_code = HSCode.objects.create(
            code="8471.30.00",
            description="Machines automatiques de traitement de l'information portatives",
            tariff_category="II", # Catégorie II = 10% Douane
            is_excise_applicable=False
        )
        
        # 3. Setup Tax Components
        self.dd_tax = TaxComponent.objects.create(code="DD", name="Droit de Douane")
        self.tva_tax = TaxComponent.objects.create(code="TVA", name="Taxe sur la Valeur Ajoutée")
        self.cci_tax = TaxComponent.objects.create(code="CCI", name="Prélèvement Communautaire")
        
        # 4. Setup Rules
        self.dd_rule = Rule.objects.create(name="DD Catégorie II (10%)", tax_component=self.dd_tax, priority=10)
        self.cci_rule = Rule.objects.create(name="Prélèvement CEMAC (1%)", tax_component=self.cci_tax, priority=20)
        self.tva_rule = Rule.objects.create(name="TVA Standard (19.25%)", tax_component=self.tva_tax, priority=30)
        
        now = timezone.now()
        
        # 5. Setup Rule Versions (The Formulas)
        # DD: CIF * 10% (only for Category II)
        RuleVersion.objects.create(
            rule=self.dd_rule,
            version_string="2026.1",
            base_formula="CIF * rate",
            default_rate=Decimal('0.1000'),
            condition_expression="CATEGORY == 'II'",
            legal_source=self.source,
            effective_from=now,
            status=RuleStatus.ACTIVE
        )
        
        # CCI: CIF * 1% (applies to all)
        RuleVersion.objects.create(
            rule=self.cci_rule,
            version_string="2026.1",
            base_formula="CIF * rate",
            default_rate=Decimal('0.0100'),
            legal_source=self.source,
            effective_from=now,
            status=RuleStatus.ACTIVE
        )
        
        # TVA: (CIF + DD + CCI) * 19.25%
        RuleVersion.objects.create(
            rule=self.tva_rule,
            version_string="2026.1",
            base_formula="(CIF + DD + CCI) * rate",
            default_rate=Decimal('0.1925'),
            legal_source=self.source,
            effective_from=now,
            status=RuleStatus.ACTIVE
        )

    def test_simulation_calculation_exact(self):
        """
        Teste que le moteur calcule précisément les montants avec les bonnes formules.
        """
        # CIF = 1,000,000 FCFA
        cif_value = Decimal('1000000')
        
        # EXPECTED:
        # DD = 1,000,000 * 10% = 100,000
        # CCI = 1,000,000 * 1% = 10,000
        # TVA = (1,000,000 + 100,000 + 10,000) * 19.25% = 1,110,000 * 0.1925 = 213,675
        # Total Taxes = 100,000 + 10,000 + 213,675 = 323,675
        
        result = CustomsCalculationService.run_simulation(self.hs_code, cif_value)
        
        self.assertEqual(result['cif_value'], Decimal('1000000'))
        self.assertEqual(result['total_taxes'], Decimal('323675'))
        self.assertEqual(result['total_to_pay'], Decimal('1323675'))
        
        # Verify breakdown
        breakdown = result['breakdown']
        self.assertEqual(len(breakdown), 3)
        
        # Since priority is 10, 20, 30:
        self.assertEqual(breakdown[0]['tax_code'], 'DD')
        self.assertEqual(breakdown[0]['amount'], Decimal('100000'))
        
        self.assertEqual(breakdown[1]['tax_code'], 'CCI')
        self.assertEqual(breakdown[1]['amount'], Decimal('10000'))
        
        self.assertEqual(breakdown[2]['tax_code'], 'TVA')
        self.assertEqual(breakdown[2]['amount'], Decimal('213675'))
