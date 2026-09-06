from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])
def mock_payment_checkout(request):
    """
    Simule une session de paiement avec succès immédiat (CinetPay / Stripe).
    À utiliser uniquement en dev/staging avant l'intégration finale.
    """
    # En situation réelle, on vérifierait request.user, le plan choisi, on créerait une transaction, etc.
    return Response({
        "status": "success",
        "message": "Paiement simulé avec succès.",
        "transaction_id": "MOCK-TXN-9999",
        "subscription_status": "ACTIVE"
    }, status=status.HTTP_200_OK)
