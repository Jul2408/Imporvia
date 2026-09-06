from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from .models import HSCode


class HSCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HSCode
        fields = ['id', 'code', 'description', 'tariff_category', 'is_excise_applicable']


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
