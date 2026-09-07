from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta

from apps.accounts.models import User
from apps.companies.models import Company, Membership
from apps.simulations.models import Simulation
from apps.core.models import AuditLog, Notification
from apps.billing.models import Plan, Subscription, Payment

from .serializers import (
    UserAdminSerializer, CompanyAdminSerializer,
    SimulationAdminSerializer, AuditLogSerializer,
    NotificationAdminSerializer, PaymentAdminSerializer,
)


class IsSuperAdmin(IsAdminUser):
    """Permission: seuls les staff Django (is_staff=True) peuvent accéder aux vues admin."""
    pass


class AdminPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdminUserViewSet(viewsets.ModelViewSet):
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    ordering_fields = ['created_at', 'email', 'last_login']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = User.objects.all().order_by('-created_at')
        is_active = self.request.query_params.get('is_active')
        is_staff = self.request.query_params.get('is_staff')
        if is_active is not None:
            qs = qs.filter(is_active=(is_active.lower() == 'true'))
        if is_staff is not None:
            qs = qs.filter(is_staff=(is_staff.lower() == 'true'))
        return qs

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        AuditLog.objects.create(
            user=request.user,
            action='USER_SUSPENDED',
            resource_type='User',
            resource_id=str(user.id),
            details={'suspended_user': user.email},
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        return Response({'status': f'Utilisateur {user.email} suspendu.'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        AuditLog.objects.create(
            user=request.user,
            action='USER_ACTIVATED',
            resource_type='User',
            resource_id=str(user.id),
            details={'activated_user': user.email},
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        return Response({'status': f'Utilisateur {user.email} réactivé.'})

    @action(detail=True, methods=['post'])
    def promote_admin(self, request, pk=None):
        user = self.get_object()
        user.is_staff = True
        user.save()
        AuditLog.objects.create(
            user=request.user,
            action='USER_PROMOTED_ADMIN',
            resource_type='User',
            resource_id=str(user.id),
            details={'promoted_user': user.email},
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        return Response({'status': f'{user.email} promu administrateur.'})

    @action(detail=True, methods=['post'])
    def demote_admin(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response({'error': 'Vous ne pouvez pas rétrograder votre propre compte.'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_staff = False
        user.save()
        AuditLog.objects.create(
            user=request.user,
            action='USER_DEMOTED',
            resource_type='User',
            resource_id=str(user.id),
            details={'demoted_user': user.email},
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        return Response({'status': f'{user.email} n\'est plus administrateur.'})

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user == request.user:
            return Response({'error': 'Vous ne pouvez pas supprimer votre propre compte.'}, status=status.HTTP_400_BAD_REQUEST)
        AuditLog.objects.create(
            user=request.user,
            action='USER_DELETED',
            resource_type='User',
            resource_id=str(user.id),
            details={'deleted_user': user.email},
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        return super().destroy(request, *args, **kwargs)


class AdminCompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanyAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tax_id', 'address']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Company.objects.annotate(
            member_count=Count('members', distinct=True),
            simulation_count=Count('simulations', distinct=True)
        ).order_by('-created_at')
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            qs = qs.filter(is_active=(is_active.lower() == 'true'))
        return qs

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        company = self.get_object()
        company.is_active = False
        company.save()
        AuditLog.objects.create(
            user=request.user,
            action='COMPANY_SUSPENDED',
            resource_type='Company',
            resource_id=str(company.id),
            details={'company_name': company.name},
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        return Response({'status': f'Entreprise {company.name} suspendue.'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        company = self.get_object()
        company.is_active = True
        company.save()
        AuditLog.objects.create(
            user=request.user,
            action='COMPANY_ACTIVATED',
            resource_type='Company',
            resource_id=str(company.id),
            details={'company_name': company.name},
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        return Response({'status': f'Entreprise {company.name} réactivée.'})

    def perform_create(self, serializer):
        company = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            action='COMPANY_CREATED',
            resource_type='Company',
            resource_id=str(company.id),
            details={'company_name': company.name},
            ip_address=self.request.META.get('REMOTE_ADDR'),
        )


class AdminSimulationViewSet(viewsets.ReadOnlyModelViewSet):
    """Accès en lecture seule à TOUTES les simulations (toutes entreprises)."""
    serializer_class = SimulationAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['reference', 'company__name', 'created_by__email']
    ordering_fields = ['created_at', 'total_to_pay', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Simulation.objects.select_related('company', 'created_by').order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter.upper())
        return qs


class AdminAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__email', 'action', 'resource_type']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = AuditLog.objects.select_related('user').order_by('-created_at')
        action_filter = self.request.query_params.get('action')
        resource_filter = self.request.query_params.get('resource_type')
        if action_filter:
            qs = qs.filter(action__icontains=action_filter)
        if resource_filter:
            qs = qs.filter(resource_type=resource_filter)
        return qs


class AdminNotificationViewSet(viewsets.ModelViewSet):
    """Gestion des notifications système (admin → tous les users ou user spécifique)."""
    serializer_class = NotificationAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'message', 'user__email']
    ordering = ['-created_at']

    def get_queryset(self):
        return Notification.objects.select_related('user').order_by('-created_at')

    def perform_create(self, serializer):
        # Si pas de user spécifié, créer pour tous les utilisateurs actifs
        target_user_id = self.request.data.get('user_id')
        if target_user_id:
            user = User.objects.get(id=target_user_id)
            serializer.save(user=user)
        else:
            # Broadcast à tous les users actifs non-staff
            title = self.request.data.get('title', '')
            message = self.request.data.get('message', '')
            users = User.objects.filter(is_active=True, is_staff=False)
            notifications = [Notification(user=u, title=title, message=message) for u in users]
            Notification.objects.bulk_create(notifications)


class AdminPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """Accès en lecture seule à tous les paiements."""
    serializer_class = PaymentAdminSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    pagination_class = AdminPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['subscription__company__name', 'transaction_id']
    ordering = ['-created_at']

    def get_queryset(self):
        return Payment.objects.select_related(
            'subscription__company', 'subscription__plan'
        ).order_by('-created_at')


class AdminAnalyticsView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def list(self, request):
        now = timezone.now()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        seven_days_ago = now - timedelta(days=7)
        thirty_days_ago = now - timedelta(days=30)

        # Users
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        users_today = User.objects.filter(created_at__gte=today).count()
        users_this_week = User.objects.filter(created_at__gte=seven_days_ago).count()
        admin_users = User.objects.filter(is_staff=True).count()

        # Companies
        total_companies = Company.objects.count()
        active_companies = Company.objects.filter(is_active=True).count()
        companies_today = Company.objects.filter(created_at__gte=today).count()

        # Simulations
        total_simulations = Simulation.objects.count()
        simulations_today = Simulation.objects.filter(created_at__gte=today).count()
        simulations_this_week = Simulation.objects.filter(created_at__gte=seven_days_ago).count()
        simulations_last_30_days = Simulation.objects.filter(created_at__gte=thirty_days_ago).count()
        simulations_completed = Simulation.objects.filter(status='COMPLETED').count()
        simulations_failed = Simulation.objects.filter(status='FAILED').count()

        # Taxes
        total_taxes_calculated = Simulation.objects.filter(
            status='COMPLETED'
        ).aggregate(total=Sum('total_taxes'))['total'] or 0

        # Audit Logs
        logs_today = AuditLog.objects.filter(created_at__gte=today).count()
        logs_this_month = AuditLog.objects.filter(created_at__gte=thirty_days_ago).count()

        return Response({
            # Users
            'total_users': total_users,
            'active_users': active_users,
            'users_today': users_today,
            'users_this_week': users_this_week,
            'admin_users': admin_users,
            # Companies
            'total_companies': total_companies,
            'active_companies': active_companies,
            'companies_today': companies_today,
            # Simulations
            'total_simulations': total_simulations,
            'simulations_today': simulations_today,
            'simulations_this_week': simulations_this_week,
            'simulations_last_30_days': simulations_last_30_days,
            'simulations_completed': simulations_completed,
            'simulations_failed': simulations_failed,
            'success_rate': round((simulations_completed / total_simulations * 100), 1) if total_simulations else 0,
            # Finances
            'total_taxes_calculated_fcfa': str(total_taxes_calculated),
            # Logs
            'logs_today': logs_today,
            'logs_this_month': logs_this_month,
        })
