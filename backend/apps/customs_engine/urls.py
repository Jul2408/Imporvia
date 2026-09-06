from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HSCodeViewSet

router = DefaultRouter()
router.register(r'hs-codes', HSCodeViewSet, basename='hs-codes')

urlpatterns = [
    path('', include(router.urls)),
]
