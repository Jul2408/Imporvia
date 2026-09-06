from django.contrib import admin
from .models import HSCode, TaxComponent, LegalSource, Rule, RuleVersion

@admin.register(HSCode)
class HSCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'tariff_category', 'is_excise_applicable']
    search_fields = ['code', 'description']
    list_filter = ['tariff_category', 'is_excise_applicable']

@admin.register(TaxComponent)
class TaxComponentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'is_active']
    list_filter = ['is_active']

@admin.register(LegalSource)
class LegalSourceAdmin(admin.ModelAdmin):
    list_display = ['reference', 'title', 'issuing_body', 'publication_date']
    search_fields = ['reference', 'title']

class RuleVersionInline(admin.TabularInline):
    model = RuleVersion
    extra = 0
    fields = ['version_string', 'base_formula', 'default_rate', 'status', 'effective_from', 'effective_to', 'legal_source']

@admin.register(Rule)
class RuleAdmin(admin.ModelAdmin):
    list_display = ['name', 'tax_component', 'priority']
    list_filter = ['tax_component']
    inlines = [RuleVersionInline]

@admin.register(RuleVersion)
class RuleVersionAdmin(admin.ModelAdmin):
    list_display = ['rule', 'version_string', 'default_rate', 'status', 'effective_from', 'effective_to']
    list_filter = ['status']
    search_fields = ['rule__name']
