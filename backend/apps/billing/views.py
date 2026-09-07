from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Plan, Subscription, Payment
from .serializers import PlanSerializer, SubscriptionSerializer, PaymentSerializer

class PlanViewSet(viewsets.ModelViewSet):
    """
    Gestion des plans (Admin)
    """
    queryset = Plan.objects.filter(is_active=True).order_by('price')
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    Gestion des abonnements (Admin)
    """
    queryset = Subscription.objects.select_related('company', 'plan').all().order_by('-created_at')
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

class PaymentViewSet(viewsets.ModelViewSet):
    """
    Historique des paiements (Admin)
    """
    queryset = Payment.objects.select_related('subscription__company', 'subscription__plan').all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([AllowAny])
def cinetpay_notify(request):
    """
    Webhook CinetPay pour la notification de paiement serveur-à-serveur.
    """
    cpm_trans_id = request.data.get('cpm_trans_id')
    cpm_site_id = request.data.get('cpm_site_id')
    cpm_trans_status = request.data.get('cpm_trans_status')
    
    if not cpm_trans_id:
        return Response({"error": "ID de transaction manquant"}, status=status.HTTP_400_BAD_REQUEST)
        
    # En production, on devrait appeler l'API de vérification CinetPay
    # pour s'assurer que c'est bien payé et valider le montant.
    # Pour l'instant, on se base sur le statut reçu (à sécuriser avant lancement via HMAC ou Check)
    
    if cpm_trans_status == 'ACCEPTED':
        # Logique pour activer l'abonnement
        # payment = Payment.objects.get(transaction_id=cpm_trans_id)
        # payment.status = 'COMPLETED'
        # payment.save()
        # payment.subscription.status = 'ACTIVE'
        # payment.subscription.save()
        return Response({"status": "success"}, status=status.HTTP_200_OK)
    
    return Response({"status": "ignored"}, status=status.HTTP_200_OK)

