from django.urls import path
from .views import NotificationListView, NotificationMarkReadView, AuditLogListView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('notifications/<uuid:pk>/', NotificationMarkReadView.as_view(), name='notification-read'),
    path('audit-logs/', AuditLogListView.as_view(), name='audit-logs'),
]
