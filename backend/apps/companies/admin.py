from django.contrib import admin
from .models import Company, Membership

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'tax_id', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'tax_id']

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'role', 'is_active', 'joined_at']
    list_filter = ['role', 'is_active']
    search_fields = ['user__email', 'company__name']
