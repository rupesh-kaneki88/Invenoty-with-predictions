import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the trained model using Joblib
model = joblib.load('rfr_product_prediction_model_2.pkl')  # Replace with your actual model filename

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define the product list with default values
product_list = [
    # (List of products as before)
]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Ensure the input is a list
    if not isinstance(data, list):
        return jsonify({"error": "Input data should be a list of objects"}), 400

    # Create a DataFrame to hold current month sales
    sales_data = {product: 0 for product in product_list}  # Initialize with zeros

    # Process incoming sales data
    for entry in data:
        product_name = entry.get('ProductID', {}).get('name', '')
        stock_sold = entry.get('StockSold', 0)

        # If the product is in our predefined list, update its stock sold
        if product_name in sales_data:
            sales_data[product_name] += stock_sold

    # Convert sales data to a DataFrame
    input_df = pd.DataFrame([sales_data])

    # Ensure only the required columns for the model (matching the training structure)
    input_df = input_df.reindex(columns=model.feature_names_in_, fill_value=0)

    # Predict next month's sales
    try:
        predictions = model.predict(input_df)
    except ValueError as e:
        return jsonify({"error": str(e)}), 500

    # Create a DataFrame for the predictions
    predicted_sales_df = pd.DataFrame(predictions, columns=model.feature_names_in_)

    # Get the top 5 products by predicted sales
    top_5_products = predicted_sales_df.T.nlargest(5, 0)

    # Reset index and prepare response
    top_5_products.reset_index(inplace=True)
    top_5_products.columns = ['Product', 'PredictedSales']

    # Convert the response to a JSON object
    response = top_5_products.to_dict(orient='records')

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000)
