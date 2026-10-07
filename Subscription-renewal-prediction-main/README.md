# Subscription Renewal Prediction using Logistic Regression

Welcome! This is my first Machine Learning project where I built a binary classification model to predict whether a customer will renew their subscription or not. The project uses a synthetic customer subscription dataset and trains a Logistic Regression model to make predictions.

---

## Project Overview

In the subscription business model, keeping existing customers (retention) is often much cheaper than finding new ones. In this project, we analyze customer attributes like age, monthly charges, tenure, and customer support calls to predict their likelihood of renewal. 

We walk through:
1. Importing the necessary data science libraries.
2. Loading and inspecting the subscription dataset.
3. Conducting basic Exploratory Data Analysis (EDA).
4. Data preprocessing (encoding categorical values, train-test splitting, scaling).
5. Training a Logistic Regression model.
6. Evaluating model performance using metrics (Accuracy, Precision, Recall, F1 Score) and plots (Confusion Matrix, ROC Curve).

---

## Dataset Description

The dataset used in this project is stored in [subscription_renewal.csv](file:///c:/Users/HP/OneDrive/Desktop/Subscriber/subscription_renewal.csv). It contains 500 rows and 7 columns.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Customer_ID` | Integer | A unique identifier for each customer (e.g., 1001, 1002...) |
| `Age` | Integer | The age of the customer (ranges from 18 to 69) |
| `Gender` | String / Object | Gender of the customer (`Male` or `Female`) |
| `Tenure` | Integer | The number of months the customer has been subscribed (1 to 24) |
| `Monthly_Charges` | Float | The amount billed to the customer monthly in USD (15.00 to 120.00) |
| `Support_Calls` | Integer | The number of customer service calls made (0 to 8) |
| `Renewal` | Integer (Binary) | Target Variable: `1` if the customer renewed, `0` if they cancelled |

---

## Features Used

We drop `Customer_ID` as it's just an index and has no predictive power. The remaining features used to predict `Renewal` are:
* **Numerical Features**: `Age`, `Tenure`, `Monthly_Charges`, `Support_Calls`
* **Categorical Feature**: `Gender` (which is encoded using `LabelEncoder`)

---

## Technologies Used

* **Language**: Python 3
* **Environment**: Jupyter Notebook
* **Libraries**:
  * **Pandas**: For reading CSV data and basic data exploration.
  * **NumPy**: For array operations and scientific computation.
  * **Matplotlib.pyplot**: For plotting basic figures and curves.
  * **Seaborn**: For high-level, beautiful statistical visualizations (heatmap, countplots, histograms).
  * **Scikit-Learn (sklearn)**: For data splitting, scaling, encoding, model training, and performance metrics evaluation.

---

## Logistic Regression

We used **Logistic Regression** because it is a simple, fast, and easy-to-understand model for binary classification. It estimates the probability of the positive class (Renewal = 1) using a logistic/sigmoid function:

$$ P(Y=1|X) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 X_1 + \dots + \beta_n X_n)}} $$

If the probability is greater than 0.5, the model predicts that the customer will renew; otherwise, it predicts cancellation.

---

## Model Performance

The model was trained on 80% of the dataset and evaluated on the remaining 20% (100 test samples). The results are:

* **Accuracy**: 84.00% (The model correctly classified 84 out of 100 test instances)
* **Precision**: 88.68% (Out of all customers predicted to renew, 88.68% actually did)
* **Recall**: 82.46% (Out of all customers who actually renewed, the model identified 82.46% of them)
* **F1 Score**: 85.45% (A harmonic mean of Precision and Recall)

### Confusion Matrix
* **True Negatives (TN)**: 37 (Correctly predicted cancellations)
* **False Positives (FP)**: 6 (Predicted renewal, but the customer cancelled)
* **False Negatives (FN)**: 10 (Predicted cancellation, but the customer renewed)
* **True Positives (TP)**: 47 (Correctly predicted renewals)

### Classification Report
```text
              precision    recall  f1-score   support

           0       0.79      0.86      0.82        43
           1       0.89      0.82      0.85        57

    accuracy                           0.84       100
   macro avg       0.84      0.84      0.84       100
weighted avg       0.84      0.84      0.84       100
```

---

## How to Run

1. Make sure you have python, pandas, numpy, matplotlib, seaborn, and scikit-learn installed:
   ```bash
   pip install pandas numpy matplotlib seaborn scikit-learn notebook
   ```
2. Download both [subscription_renewal.csv](file:///c:/Users/HP/OneDrive/Desktop/Subscriber/subscription_renewal.csv) and [Subscription_Renewal_Prediction.ipynb](file:///c:/Users/HP/OneDrive/Desktop/Subscriber/Subscription_Renewal_Prediction.ipynb) in the same directory.
3. Open terminal/command prompt in that directory and run:
   ```bash
   jupyter notebook
   ```
4. Click on [Subscription_Renewal_Prediction.ipynb](file:///c:/Users/HP/OneDrive/Desktop/Subscriber/Subscription_Renewal_Prediction.ipynb) and run all cells!

---

## Conclusion

This project successfully demonstrates how Logistic Regression can help a subscription business identify customers who are likely to cancel. 
* Customers with longer **Tenure** are highly likely to renew.
* Customers who make many **Support_Calls** or have very high **Monthly_Charges** are less likely to renew.
* With a classification accuracy of **84%**, this simple ML model performs well and provides a strong foundation for future, more complex models.
