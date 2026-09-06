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
        
        # 1. Fetch active rules ordered by priority
        active_versions = RuleVersion.objects.filter(
            status=RuleStatus.ACTIVE,
            effective_from__lte=now
        ).exclude(
            effective_to__lt=now
        ).select_related('rule', 'rule__tax_component')
        
        # Sort explicitly in Python just in case (priority ascending)
        active_versions = sorted(active_versions, key=lambda v: v.rule.priority)
        
        # 2. Context dictionary for formula evaluation
        context = {
            'CIF': cif,
            'TOTAL_TAXES': Decimal('0'),
            'CATEGORY': hs_code_obj.tariff_category,
            'EXCISE': hs_code_obj.is_excise_applicable
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
            
            # Store result
            tax_code = version.rule.tax_component.code
            results.append({
                'tax_code': tax_code,
                'tax_name': version.rule.tax_component.name,
                'rule_name': version.rule.name,
                'rate': str(version.default_rate) if version.default_rate else None,
                'amount': amount,
                'formula_used': version.base_formula
            })
            
            # Update context for subsequent rules (e.g. TVA depends on CIF + DD)
            context[tax_code] = amount
            total_taxes += amount
            context['TOTAL_TAXES'] = total_taxes
            
        return {
            'cif_value': cif,
            'total_taxes': total_taxes,
            'total_to_pay': cif + total_taxes,
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
