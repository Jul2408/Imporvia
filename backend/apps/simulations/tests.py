from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.customs_engine.models import HSCode
from apps.simulations.models import Simulation

class SimulationAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="testpassword123"
        )
        self.hs_code = HSCode.objects.create(
            code="8471.30.00",
            description="Laptop computer",
            tariff_category="II"
        )

    def test_create_simulation_without_initial_company(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/simulations/', {
            'cif_value': '1000000',
            'hs_code': self.hs_code.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Simulation.objects.count(), 1)
        simulation = Simulation.objects.first()
        self.assertIsNotNone(simulation.company)
        self.assertEqual(simulation.created_by, self.user)
