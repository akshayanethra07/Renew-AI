import os
import joblib
import numpy as np
from django.conf import settings


# Load trained model and scaler
MODEL_PATH = os.path.join(settings.BASE_DIR, "subscription_model.pkl")
SCALER_PATH = os.path.join(settings.BASE_DIR, "scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


def predict_renewal(age, gender, tenure, monthly_charges, support_calls):

    # Gender was encoded using LabelEncoder in the notebook.
    # We need to use the same mapping:
    # Female = 0
    # Male = 1
    gender_encoded = 1 if gender.lower() == "male" else 0

    # IMPORTANT:
    # Feature order must match the notebook:
    # Age, Gender, Tenure, Monthly_Charges, Support_Calls
    features = np.array([[
        age,
        gender_encoded,
        tenure,
        monthly_charges,
        support_calls
    ]], dtype=float)

    # Apply the SAME scaler used during training
    features_scaled = scaler.transform(features)

    # Make prediction
    prediction = model.predict(features_scaled)[0]

    # Get probability
    probabilities = model.predict_proba(features_scaled)[0]
    renewal_probability = probabilities[1] * 100

    return {
        "prediction": int(prediction),
        "renewal_probability": round(float(renewal_probability), 2),
        "status": "Likely to Renew" if prediction == 1 else "At Risk"
    }