from django.urls import path
from .views import predict, customers, predictions

urlpatterns = [
    path('predict/', predict, name='predict'),
    path('customers/', customers, name='customers'),
    path('predictions/', predictions, name='predictions'),
]