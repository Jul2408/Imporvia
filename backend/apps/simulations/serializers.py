from rest_framework import serializers
from .models import Simulation, CalculationSnapshot

class CalculationSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationSnapshot
        fields = '__all__'

class SimulationSerializer(serializers.ModelSerializer):
    snapshot = CalculationSnapshotSerializer(read_only=True)
    hs_code_display = serializers.CharField(source='hs_code.code', read_only=True)
    
    class Meta:
        model = Simulation
        fields = '__all__'
        read_only_fields = ['id', 'reference', 'company', 'created_by', 'status', 'total_taxes', 'total_to_pay']
