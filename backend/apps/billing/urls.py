from django.urls import path
from .views import mock_payment_checkout

urlpatterns = [
    path('payments/mock-checkout/', mock_payment_checkout, name='mock_payment_checkout'),
]
