"""
Commande Django: python manage.py seed_customs_2026

Charge les données douanières réelles du Cameroun (CEMAC/TEC 2026) en base de données:
- Composantes fiscales (DD, TVA, CCI, RDI, etc.)
- Codes SH les plus courants (chapitre 1-97)
- Règles de calcul versionnées sourcées depuis la Loi de Finances 2026

Sources:
- TEC CEMAC (5ème édition 2022, en vigueur 2026)
- Loi de Finances 2026 Cameroun
- Code des Douanes CEMAC
"""
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.customs_engine.models import (
    HSCode, TaxComponent, LegalSource, Rule, RuleVersion, RuleStatus
)


# ============================================================
# DONNÉES RÉELLES TEC CEMAC 2026
# ============================================================
# 4 catégories principales TEC CEMAC:
#   Cat I  (0%)  - Biens de première nécessité, intrants agricoles
#   Cat II (10%) - Matières premières, intrants industriels
#   Cat III(20%) - Intrants et produits intermédiaires
#   Cat IV (30%) - Biens de consommation finale
# ============================================================

HS_CODES_2026 = [
    # CHAPITRE 84 - Machines et appareils mécaniques
    {"code": "8471.30.00", "description": "Machines automatiques de traitement de l'information portatives (laptops, notebooks)", "chapter": "84", "tariff_category": "II"},
    {"code": "8471.41.00", "description": "Autres machines automatiques de traitement de l'information (PC de bureau)", "chapter": "84", "tariff_category": "II"},
    {"code": "8471.60.00", "description": "Unités d'entrée ou de sortie (imprimantes, scanners)", "chapter": "84", "tariff_category": "II"},
    {"code": "8443.31.00", "description": "Machines pour l'impression par jet d'encre", "chapter": "84", "tariff_category": "III"},
    {"code": "8418.10.00", "description": "Réfrigérateurs-congélateurs combinés", "chapter": "84", "tariff_category": "IV"},
    {"code": "8421.19.00", "description": "Autres centrifugeuses", "chapter": "84", "tariff_category": "III"},
    {"code": "8422.11.00", "description": "Machines à laver la vaisselle du type ménager", "chapter": "84", "tariff_category": "IV"},
    {"code": "8450.11.00", "description": "Machines à laver le linge entièrement automatiques <= 10kg", "chapter": "84", "tariff_category": "IV"},
    {"code": "8516.50.00", "description": "Fours à micro-ondes", "chapter": "84", "tariff_category": "IV"},

    # CHAPITRE 85 - Machines et appareils électriques
    {"code": "8517.12.00", "description": "Téléphones pour réseaux cellulaires (smartphones)", "chapter": "85", "tariff_category": "IV"},
    {"code": "8521.90.00", "description": "Appareils d'enregistrement ou de reproduction vidéographiques", "chapter": "85", "tariff_category": "IV"},
    {"code": "8525.89.00", "description": "Appareils de prise de vues fixes numériques (appareil photo)", "chapter": "85", "tariff_category": "IV"},
    {"code": "8528.72.00", "description": "Téléviseurs en couleurs à écran plat LCD/LED", "chapter": "85", "tariff_category": "IV"},
    {"code": "8544.42.00", "description": "Conducteurs électriques pour tension <= 1000V", "chapter": "85", "tariff_category": "III"},

    # CHAPITRE 87 - Véhicules automobiles
    {"code": "8703.23.11", "description": "Véhicule tourisme essence < 1500cc neuf", "chapter": "87", "tariff_category": "IV", "is_excise_applicable": True},
    {"code": "8703.23.91", "description": "Véhicule tourisme essence < 1500cc d'occasion", "chapter": "87", "tariff_category": "IV", "is_excise_applicable": True},
    {"code": "8704.21.10", "description": "Véhicule de transport marchandise diesel <= 5T neuf", "chapter": "87", "tariff_category": "III"},
    {"code": "8711.60.00", "description": "Motocycles à moteur électrique", "chapter": "87", "tariff_category": "III"},

    # CHAPITRE 10 - Céréales
    {"code": "1001.99.00", "description": "Froment (blé) et méteil (autre)", "chapter": "10", "tariff_category": "I"},
    {"code": "1006.30.00", "description": "Riz semi-blanchi ou blanchi", "chapter": "10", "tariff_category": "I"},
    {"code": "1101.00.00", "description": "Farines de froment (blé) ou de méteil", "chapter": "11", "tariff_category": "I"},
    {"code": "1701.14.00", "description": "Sucre de canne brut (à l'état solide)", "chapter": "17", "tariff_category": "I"},

    # CHAPITRE 27 - Combustibles
    {"code": "2710.12.11", "description": "Essences spéciales pour carburants (non taxés à l'accise ici)", "chapter": "27", "tariff_category": "I"},
    {"code": "2710.19.21", "description": "Gas-oil (gazole)", "chapter": "27", "tariff_category": "I"},

    # CHAPITRE 30 - Produits pharmaceutiques
    {"code": "3004.90.00", "description": "Médicaments préparés pour la vente au détail (autres)", "chapter": "30", "tariff_category": "I"},
    {"code": "3002.15.00", "description": "Vaccins pour la médecine humaine", "chapter": "30", "tariff_category": "I"},

    # CHAPITRE 39 - Matières plastiques
    {"code": "3923.30.00", "description": "Bonbonnes, bouteilles, flacons et articles similaires en plastique", "chapter": "39", "tariff_category": "III"},

    # CHAPITRE 61/62 - Habillement
    {"code": "6110.20.00", "description": "Chandails, pull-overs en coton (tricotés)", "chapter": "61", "tariff_category": "IV"},
    {"code": "6204.62.00", "description": "Pantalons pour femmes en coton", "chapter": "62", "tariff_category": "IV"},

    # CHAPITRE 72 - Fer et acier
    {"code": "7213.91.00", "description": "Fil machine en acier (ronds à béton)", "chapter": "72", "tariff_category": "II"},
    {"code": "7308.90.00", "description": "Constructions et parties de constructions en acier", "chapter": "73", "tariff_category": "II"},
]

# ============================================================
# COMPOSANTES FISCALES CAMEROUN 2026
# ============================================================
TAX_COMPONENTS = [
    {"code": "DD",   "name": "Droit de Douane"},
    {"code": "TVA",  "name": "Taxe sur la Valeur Ajoutée"},
    {"code": "CCI",  "name": "Contribution Communautaire d'Intégration (CEMAC)"},
    {"code": "RDI",  "name": "Redevance Informatique"},
    {"code": "FCS",  "name": "Frais de Contrôle Sanitaire"},
    {"code": "ACCS", "name": "Accise Spécifique"},
]

# ============================================================
# RÈGLES VERSIONNÉES 2026 (Loi de Finances Cameroun 2026)
# Sources: Loi n° 2025/013 du 15 Déc 2025 portant Loi de Finances 2026
# TEC CEMAC (5ème édition) + Annexes LF2026
# ============================================================
RULES_2026 = [
    {
        "rule_name": "Droit de Douane - Catégorie I (0%)",
        "tax_component_code": "DD",
        "priority": 10,
        "base_formula": "CIF * rate",
        "default_rate": Decimal("0.0000"),
        "condition": "CATEGORY == 'I'",
    },
    {
        "rule_name": "Droit de Douane - Catégorie II (10%)",
        "tax_component_code": "DD",
        "priority": 11,
        "base_formula": "CIF * rate",
        "default_rate": Decimal("0.1000"),
        "condition": "CATEGORY == 'II'",
    },
    {
        "rule_name": "Droit de Douane - Catégorie III (20%)",
        "tax_component_code": "DD",
        "priority": 12,
        "base_formula": "CIF * rate",
        "default_rate": Decimal("0.2000"),
        "condition": "CATEGORY == 'III'",
    },
    {
        "rule_name": "Droit de Douane - Catégorie IV (30%)",
        "tax_component_code": "DD",
        "priority": 13,
        "base_formula": "CIF * rate",
        "default_rate": Decimal("0.3000"),
        "condition": "CATEGORY == 'IV'",
    },
    {
        "rule_name": "Contribution Communautaire d'Intégration (CCI/CEMAC) - 1%",
        "tax_component_code": "CCI",
        "priority": 20,
        "base_formula": "CIF * rate",
        "default_rate": Decimal("0.0100"),
        "condition": "",
    },
    {
        "rule_name": "Redevance Informatique (RDI) - 0.45%",
        "tax_component_code": "RDI",
        "priority": 21,
        "base_formula": "CIF * rate",
        "default_rate": Decimal("0.0045"),
        "condition": "",
    },
    {
        "rule_name": "TVA Standard Cameroun - 19.25% (base: CIF + DD + CCI + RDI)",
        "tax_component_code": "TVA",
        "priority": 30,
        "base_formula": "(CIF + DD + CCI + RDI) * rate",
        "default_rate": Decimal("0.1925"),
        "condition": "",
    },
]


class Command(BaseCommand):
    help = "Charge les données douanières 2026 (Cameroun - CEMAC) en base de données."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== IMPORVIA — Seeder Douanier 2026 ==="))

        # 1. Source légale
        source, _ = LegalSource.objects.get_or_create(
            reference="LF2026-CEMAC",
            defaults={
                "title": "Loi de Finances 2026 Cameroun & TEC CEMAC 5ème éd.",
                "issuing_body": "Ministère des Finances Cameroun / Commission CEMAC",
                "publication_date": "2025-12-15",
                "url": "https://www.douanes.cm"
            }
        )
        self.stdout.write(f"  [OK] Source légale : {source.reference}")

        # 2. Composantes fiscales
        for tc_data in TAX_COMPONENTS:
            obj, created = TaxComponent.objects.get_or_create(
                code=tc_data["code"],
                defaults={"name": tc_data["name"]}
            )
            status = "créé" if created else "existant"
            self.stdout.write(f"  [OK] TaxComponent [{obj.code}] — {status}")

        # 3. Codes SH
        self.stdout.write(self.style.MIGRATE_HEADING("\n--- Codes SH ---"))
        for hs_data in HS_CODES_2026:
            obj, created = HSCode.objects.get_or_create(
                code=hs_data["code"],
                defaults={
                    "description": hs_data["description"],
                    "chapter": hs_data.get("chapter", ""),
                    "tariff_category": hs_data.get("tariff_category", ""),
                    "is_excise_applicable": hs_data.get("is_excise_applicable", False),
                }
            )
            status = "créé" if created else "existant"
            self.stdout.write(f"  [OK] HSCode [{obj.code}] — {status}")

        # 4. Règles de calcul versionnées
        self.stdout.write(self.style.MIGRATE_HEADING("\n--- Règles de Calcul 2026 ---"))
        now = timezone.now()
        for rule_data in RULES_2026:
            tax_component = TaxComponent.objects.get(code=rule_data["tax_component_code"])
            rule, r_created = Rule.objects.get_or_create(
                name=rule_data["rule_name"],
                defaults={
                    "tax_component": tax_component,
                    "priority": rule_data["priority"],
                }
            )
            version, v_created = RuleVersion.objects.get_or_create(
                rule=rule,
                version_string="2026.1",
                defaults={
                    "base_formula": rule_data["base_formula"],
                    "default_rate": rule_data["default_rate"],
                    "condition_expression": rule_data["condition"],
                    "legal_source": source,
                    "effective_from": now,
                    "status": RuleStatus.ACTIVE,
                }
            )
            action = "créée" if v_created else "existante"
            self.stdout.write(f"  [OK] Règle [{rule.name}] v2026.1 — {action}")

        self.stdout.write(self.style.SUCCESS("\n[OK] Seeder termine avec succes! Donnees 2026 chargees.\n"))
