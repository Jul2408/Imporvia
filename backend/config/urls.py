from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('django-admin/', admin.site.urls),

    # Auth & Users
    path('api/v1/', include('apps.accounts.urls')),

    # Companies & Memberships
    path('api/v1/', include('apps.companies.urls')),

    # Customs Engine (HS Codes search)
    path('api/v1/customs/', include('apps.customs_engine.urls')),

    # Simulations
    path('api/v1/', include('apps.simulations.urls')),

    # Billing (Mock pour l'instant)
    path('api/v1/billing/', include('apps.billing.urls')),

    # Notifications & Audit
    path('api/v1/', include('apps.core.urls')),

    # Super Admin API
    path('api/v1/admin/', include('apps.admin_panel.urls')),
]
