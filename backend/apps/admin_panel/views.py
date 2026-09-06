from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta

from apps.accounts.models import User
from apps.companies.models import Company
from apps.simulations.models import Simulation
from apps.core.models import AuditLog

from .serializers import (
    UserAdminSerializer, CompanyAdminSerializer,
    SimulationAdminSerializer, AuditLogSerializer
)


class IsSuperAdmin(IsAdminUser):
    """Permission: seuls les staff Django (is_staff=True) peuvent accéder aux vues admin."""
    pass


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'status': f'Utilisateur {user.email} suspendu.'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': f'Utilisateur {user.email} réactivé.'})


class AdminCompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.annotate(
        member_count=Count('members'),
        simulation_count=Count('simulations')
    ).order_by('-created_at')
    serializer_class = CompanyAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        company = self.get_object()
        company.is_active = False
        company.save()
        return Response({'status': f'Entreprise {company.name} suspendue.'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        company = self.get_object()
        company.is_active = True
        company.save()
        return Response({'status': f'Entreprise {company.name} réactivée.'})


class AdminSimulationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Simulation.objects.select_related('company', 'created_by').order_by('-created_at')
    serializer_class = SimulationAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]


class AdminAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related('user').order_by('-created_at')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]


class AdminAnalyticsView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def list(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        total_companies = Company.objects.count()
        active_companies = Company.objects.filter(is_active=True).count()
        total_users = User.objects.count()
        total_simulations = Simulation.objects.count()
        simulations_last_30_days = Simulation.objects.filter(created_at__gte=thirty_days_ago).count()
        total_taxes_calculated = Simulation.objects.filter(
            status='COMPLETED'
        ).aggregate(total=Sum('total_taxes'))['total'] or 0

        return Response({
            'total_companies': total_companies,
            'active_companies': active_companies,
            'total_users': total_users,
            'total_simulations': total_simulations,
            'simulations_last_30_days': simulations_last_30_days,
            'total_taxes_calculated_fcfa': str(total_taxes_calculated),
        })
