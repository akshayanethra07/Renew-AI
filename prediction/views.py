from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .ml_model import predict_renewal
from .models import Customer, Prediction


# ============================================================
# 1. PREDICTION API
# ============================================================

@api_view(['POST'])
def predict(request):
    try:
        # Get data from frontend
        age = int(request.data.get('age'))
        gender = request.data.get('gender')
        tenure = int(request.data.get('tenure'))
        monthly_charges = float(request.data.get('monthly_charges'))
        support_calls = int(request.data.get('support_calls'))

        # Validate gender
        if not gender:
            return Response(
                {"error": "Gender is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Run ML prediction
        result = predict_renewal(
            age,
            gender,
            tenure,
            monthly_charges,
            support_calls
        )

        # Save customer details
        customer = Customer.objects.create(
            age=age,
            gender=gender,
            tenure=tenure,
            monthly_charges=monthly_charges,
            support_calls=support_calls
        )

        # Save prediction result
        Prediction.objects.create(
            customer=customer,
            prediction=result["prediction"],
            renewal_probability=result["renewal_probability"],
            status=result["status"]
        )

        # Send result to frontend
        return Response(
            {
                "customer_id": customer.customer_id,
                "prediction": result["prediction"],
                "renewal_probability": result["renewal_probability"],
                "status": result["status"]
            },
            status=status.HTTP_200_OK
        )

    except (TypeError, ValueError):
        return Response(
            {"error": "Please provide valid customer data"},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================
# 2. CUSTOMERS API
# ============================================================

@api_view(['GET'])
def customers(request):

    # Get all customers, newest first
    customer_list = Customer.objects.all().order_by('-created_at')

    data = []

    for customer in customer_list:

        # Get latest prediction for this customer
        latest_prediction = customer.predictions.order_by(
            '-predicted_at'
        ).first()

        data.append({
            "customer_id": customer.customer_id,
            "age": customer.age,
            "gender": customer.gender,
            "tenure": customer.tenure,
            "monthly_charges": customer.monthly_charges,
            "support_calls": customer.support_calls,

            "prediction": (
                latest_prediction.prediction
                if latest_prediction
                else None
            ),

            "renewal_probability": (
                latest_prediction.renewal_probability
                if latest_prediction
                else None
            ),

            "status": (
                latest_prediction.status
                if latest_prediction
                else None
            ),

            "created_at": customer.created_at,
        })

    return Response(data, status=status.HTTP_200_OK)
@api_view(['GET'])
def predictions(request):
    prediction_list = Prediction.objects.select_related(
        'customer'
    ).order_by('-predicted_at')

    data = []

    for prediction in prediction_list:
        customer = prediction.customer

        data.append({
            "prediction_id": prediction.id,
            "customer_id": customer.customer_id,
            "age": customer.age,
            "gender": customer.gender,
            "tenure": customer.tenure,
            "monthly_charges": customer.monthly_charges,
            "support_calls": customer.support_calls,
            "prediction": prediction.prediction,
            "renewal_probability": prediction.renewal_probability,
            "status": prediction.status,
            "predicted_at": prediction.predicted_at,
        })

    return Response(data, status=status.HTTP_200_OK)