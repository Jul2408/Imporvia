from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, MembershipViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')

urlpatterns = [
    path('', include(router.urls)),
    path('companies/<uuid:company_pk>/members/', MembershipViewSet.as_view({'get': 'list', 'post': 'create'}), name='company-members'),
]
