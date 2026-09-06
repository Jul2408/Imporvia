from django.contrib import admin
from .models import Simulation, CalculationSnapshot

class SnapshotInline(admin.TabularInline):
    model = CalculationSnapshot
    extra = 0
    readonly_fields = ['engine_version', 'rules_version_stamp', 'breakdown_payload', 'created_at']
    can_delete = False

@admin.register(Simulation)
class SimulationAdmin(admin.ModelAdmin):
    list_display = ['reference', 'company', 'created_by', 'status', 'cif_value', 'total_taxes', 'total_to_pay', 'created_at']
    list_filter = ['status']
    search_fields = ['reference', 'company__name']
    readonly_fields = ['id', 'reference', 'total_taxes', 'total_to_pay', 'created_at', 'updated_at']
    inlines = [SnapshotInline]
