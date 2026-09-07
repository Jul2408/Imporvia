from decimal import Decimal, ROUND_HALF_UP
from django.utils import timezone
from .models import RuleVersion, RuleStatus, HSCode

class CustomsCalculationService:
    """
    Service Indépendant de calcul douanier pour ImporVia.
    Résout les règles actives, évalue les conditions et génère un rapport explicatif.
    """
    
    @staticmethod
    def calculate_cif(fob_value, freight, insurance):
        fob = Decimal(str(fob_value))
        f = Decimal(str(freight))
        i = Decimal(str(insurance))
        return fob + f + i

    @staticmethod
    def run_simulation(hs_code_obj, cif_value):
        """
        Calcule les taxes pour un code SH donné et une valeur CIF.
        Retourne un dictionnaire explicatif détaillé (Breakdown).
        """
        cif = Decimal(str(cif_value))
        now = timezone.now()
        
        # Safely extract category and excise
        category = getattr(hs_code_obj, 'tariff_category', 'IV') if hs_code_obj else 'IV'
        is_excise = getattr(hs_code_obj, 'is_excise_applicable', False) if hs_code_obj else False

        # 1. Fetch active rules ordered by priority
        active_versions = list(RuleVersion.objects.filter(
            status=RuleStatus.ACTIVE
        ).select_related('rule', 'rule__tax_component'))
        
        # Filter effective dates in Python safely
        active_versions = [
            v for v in active_versions
            if (v.effective_from is None or v.effective_from <= now) and
               (v.effective_to is None or v.effective_to >= now)
        ]
        
        # Sort explicitly in Python (priority ascending)
        active_versions = sorted(active_versions, key=lambda v: v.rule.priority)
        
        # 2. Context dictionary for formula evaluation
        context = {
            'CIF': cif,
            'TOTAL_TAXES': Decimal('0'),
            'CATEGORY': category or 'IV',
            'EXCISE': is_excise
        }
        
        results = []
        total_taxes = Decimal('0')
        
        # 3. Evaluate each rule
        for version in active_versions:
            # Check condition if any (e.g. "CATEGORY == 'I'")
            if version.condition_expression:
                if not CustomsCalculationService._evaluate_condition(version.condition_expression, context):
                    continue
                    
            # Calculate amount
            amount = CustomsCalculationService._evaluate_formula(
                version.base_formula, 
                version.default_rate, 
                version.fixed_amount, 
                context
            )
            
            # Arrondi à l'entier le plus proche (Règle douanière standard)
            amount = amount.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
            
            # Store result (convert Decimal to str for JSON serialization compatibility)
            tax_code = version.rule.tax_component.code
            results.append({
                'tax_code': tax_code,
                'tax_name': version.rule.tax_component.name,
                'rule_name': version.rule.name,
                'rate': str(version.default_rate) if version.default_rate else None,
                'amount': str(amount),
                'formula_used': version.base_formula
            })
            
            # Update context for subsequent rules (e.g. TVA depends on CIF + DD)
            context[tax_code] = amount
            total_taxes += amount
            context['TOTAL_TAXES'] = total_taxes
            
        # Fallback if no rules matched
        if not results:
            dd_rate = Decimal('0.30') if category == 'IV' else Decimal('0.20') if category == 'III' else Decimal('0.10') if category == 'II' else Decimal('0.00')
            dd_amount = (cif * dd_rate).quantize(Decimal('1'), rounding=ROUND_HALF_UP)
            cci_amount = (cif * Decimal('0.01')).quantize(Decimal('1'), rounding=ROUND_HALF_UP)
            rdi_amount = (cif * Decimal('0.0045')).quantize(Decimal('1'), rounding=ROUND_HALF_UP)
            tva_amount = ((cif + dd_amount + cci_amount + rdi_amount) * Decimal('0.1925')).quantize(Decimal('1'), rounding=ROUND_HALF_UP)

            results = [
                {'tax_code': 'DD', 'tax_name': 'Droit de Douane', 'rule_name': f'DD ({int(dd_rate*100)}%)', 'rate': str(dd_rate), 'amount': str(dd_amount), 'formula_used': 'CIF * rate'},
                {'tax_code': 'CCI', 'tax_name': "Contribution Communautaire d'Intégration", 'rule_name': 'CCI (1%)', 'rate': '0.01', 'amount': str(cci_amount), 'formula_used': 'CIF * rate'},
                {'tax_code': 'RDI', 'tax_name': 'Redevance Informatique', 'rule_name': 'RDI (0.45%)', 'rate': '0.0045', 'amount': str(rdi_amount), 'formula_used': 'CIF * rate'},
                {'tax_code': 'TVA', 'tax_name': 'Taxe sur la Valeur Ajoutée', 'rule_name': 'TVA Cameroun (19.25%)', 'rate': '0.1925', 'amount': str(tva_amount), 'formula_used': '(CIF + DD + CCI + RDI) * rate'},
            ]
            total_taxes = dd_amount + cci_amount + rdi_amount + tva_amount

        return {
            'cif_value': str(cif),
            'total_taxes': str(total_taxes),
            'total_to_pay': str(cif + total_taxes),
            'breakdown': results
        }
        
    @staticmethod
    def _evaluate_condition(expression, context):
        """ Évaluation sécurisée restreinte. """
        allowed_names = {k: v for k, v in context.items()}
        try:
            return eval(expression, {"__builtins__": {}}, allowed_names)
        except Exception:
            return False

    @staticmethod
    def _evaluate_formula(formula, rate, fixed_amount, context):
        """ 
        Formules dynamiques (ex: 'CIF * rate', '(CIF + DD) * rate')
        """
        allowed_names = {k: v for k, v in context.items()}
        if rate is not None:
            allowed_names['rate'] = Decimal(str(rate))
        if fixed_amount is not None:
            allowed_names['fixed_amount'] = Decimal(str(fixed_amount))
            
        try:
            result = eval(formula, {"__builtins__": {}}, allowed_names)
            return Decimal(str(result))
        except Exception as e:
            # En production, ce bloc doit être loggé (Sentry)
            print(f"Error evaluating formula {formula}: {e}")
            return Decimal('0')
