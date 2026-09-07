from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from .models import HSCode, TaxComponent, Rule, RuleVersion

# --- Serializers ---

class HSCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HSCode
        fields = ['id', 'code', 'description', 'tariff_category', 'is_excise_applicable']

class TaxComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxComponent
        fields = ['id', 'name', 'code', 'description', 'is_active']

class RuleVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleVersion
        fields = ['id', 'version_string', 'base_formula', 'default_rate', 'fixed_amount', 'condition_expression', 'status']

class RuleSerializer(serializers.ModelSerializer):
    tax_component = TaxComponentSerializer(read_only=True)
    tax_component_id = serializers.UUIDField(write_only=True)
    versions = RuleVersionSerializer(many=True, read_only=True)

    class Meta:
        model = Rule
        fields = ['id', 'name', 'tax_component', 'tax_component_id', 'priority', 'versions', 'created_at', 'updated_at']

# --- ViewSets ---

class HSCodeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint de recherche des codes SH. Utilisé par le Wizard de simulation.
    Supporte la recherche par code ou description: /api/v1/customs/hs-codes/?search=laptop
    """
    serializer_class = HSCodeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = HSCode.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(code__icontains=search) | HSCode.objects.filter(description__icontains=search)
        return qs.order_by('code')[:50]  # Limite à 50 résultats pour les performances

class TaxComponentViewSet(viewsets.ModelViewSet):
    """CRUD for Tax Components"""
    serializer_class = TaxComponentSerializer
    permission_classes = [IsAuthenticated]
    queryset = TaxComponent.objects.all().order_by('code')

class RuleViewSet(viewsets.ModelViewSet):
    """CRUD for Rules (used for defining how taxes are calculated)"""
    serializer_class = RuleSerializer
    permission_classes = [IsAuthenticated]
    queryset = Rule.objects.select_related('tax_component').prefetch_related('versions').all().order_by('priority')

