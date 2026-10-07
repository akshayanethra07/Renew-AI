from django.db import models


class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    tenure = models.IntegerField()
    monthly_charges = models.FloatField()
    support_calls = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Customer {self.customer_id}"


class Prediction(models.Model):
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="predictions"
    )
    prediction = models.IntegerField()
    renewal_probability = models.FloatField()
    status = models.CharField(max_length=50)
    predicted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer} - {self.status}"