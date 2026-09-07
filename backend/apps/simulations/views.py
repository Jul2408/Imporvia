import uuid
from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Simulation, SimulationStatus, CalculationSnapshot
from .serializers import SimulationSerializer
from apps.customs_engine.models import HSCode
from apps.customs_engine.services import CustomsCalculationService

class SimulationViewSet(viewsets.ModelViewSet):
    serializer_class = SimulationSerializer
    permission_classes = [IsAuthenticated]
    
    def _get_user_company(self, user):
        membership = user.memberships.filter(is_active=True).first()
        if not membership:
            from apps.companies.models import Company, Membership, Role
            company_name = f"Entreprise de {user.full_name.strip() or user.email.split('@')[0]}"
            company, _ = Company.objects.get_or_create(name=company_name)
            membership, _ = Membership.objects.get_or_create(
                user=user,
                company=company,
                defaults={'role': Role.OWNER, 'is_active': True}
            )
        return membership.company

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Simulation.objects.none()
        company = self._get_user_company(self.request.user)
        return Simulation.objects.filter(company=company)
        
    def _get_or_create_default_hscode(self):
        hs = HSCode.objects.first()
        if not hs:
            hs = HSCode.objects.create(
                code="8517.12.00",
                description="Téléphones pour réseaux cellulaires (smartphones)",
                tariff_category="IV",
                is_excise_applicable=False
            )
        return hs

    def perform_create(self, serializer):
        company = self._get_user_company(self.request.user)
        ref = f"SIM-{uuid.uuid4().hex[:8].upper()}"
        hs_code = serializer.validated_data.get('hs_code')
        if not hs_code:
            hs_code = self._get_or_create_default_hscode()
        serializer.save(
            company=company,
            created_by=self.request.user,
            reference=ref,
            hs_code=hs_code
        )


    @action(detail=True, methods=['post'])
    def calculate(self, request, pk=None):
        simulation = self.get_object()
        
        if not simulation.hs_code:
            simulation.hs_code = self._get_or_create_default_hscode()
            simulation.save()
            
        if not simulation.cif_value:
            if simulation.fob_value is not None:
                simulation.cif_value = CustomsCalculationService.calculate_cif(
                    simulation.fob_value, simulation.freight or 0, simulation.insurance or 0
                )
            else:
                simulation.cif_value = Decimal('100000')
            simulation.save()
                
        # Run independent calculation engine
        try:
            result = CustomsCalculationService.run_simulation(simulation.hs_code, simulation.cif_value)
            
            # Update Simulation model
            simulation.total_taxes = Decimal(str(result['total_taxes']))
            simulation.total_to_pay = Decimal(str(result['total_to_pay']))
            simulation.status = SimulationStatus.COMPLETED
            simulation.save()
            
            # Create Snapshot to freeze history
            CalculationSnapshot.objects.update_or_create(
                simulation=simulation,
                defaults={
                    'engine_version': '1.0.0',
                    'rules_version_stamp': '2026_CURRENT',
                    'breakdown_payload': result
                }
            )
            
            return Response(SimulationSerializer(simulation).data)
            
        except Exception as e:
            simulation.status = SimulationStatus.FAILED
            simulation.save()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
