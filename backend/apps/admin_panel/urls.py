from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminUserViewSet, AdminCompanyViewSet,
    AdminSimulationViewSet, AdminAuditLogViewSet,
    AdminAnalyticsView, AdminNotificationViewSet,
    AdminPaymentViewSet
)

router = DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'companies', AdminCompanyViewSet, basename='admin-companies')
router.register(r'simulations', AdminSimulationViewSet, basename='admin-simulations')
router.register(r'audit-logs', AdminAuditLogViewSet, basename='admin-audit-logs')
router.register(r'analytics', AdminAnalyticsView, basename='admin-analytics')
router.register(r'notifications', AdminNotificationViewSet, basename='admin-notifications')
router.register(r'payments', AdminPaymentViewSet, basename='admin-payments')

urlpatterns = [
    path('', include(router.urls)),
]
