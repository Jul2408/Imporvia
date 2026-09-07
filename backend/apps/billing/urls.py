from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import cinetpay_notify, PlanViewSet, SubscriptionViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'plans', PlanViewSet, basename='plans')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscriptions')
router.register(r'payments', PaymentViewSet, basename='payments')

urlpatterns = [
    path('cinetpay/notify/', cinetpay_notify, name='cinetpay_notify'),
    path('', include(router.urls)),
]
