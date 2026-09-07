from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HSCodeViewSet, TaxComponentViewSet, RuleViewSet

router = DefaultRouter()
router.register(r'hs-codes', HSCodeViewSet, basename='hs-codes')
router.register(r'tax-components', TaxComponentViewSet, basename='tax-components')
router.register(r'rules', RuleViewSet, basename='rules')

urlpatterns = [
    path('', include(router.urls)),
]
