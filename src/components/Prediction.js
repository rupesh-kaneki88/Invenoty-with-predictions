const { model } = require("mongoose");

// Function to fetch total sales data and make a prediction request
async function getPrediction() {
    try {
      // Step 1: Fetch total sales data from the get API
      const response = await fetch(`http://localhost:4000/api/product/get/${authContext.user}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
  
      const salesData = await response.json();
  
      // Assuming the salesData object matches the expected input structure for the prediction model
      // Step 2: Pass the sales data to the prediction API
      const predictionResponse = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salesData), // Pass sales data in the request body
      });
  
      if (!predictionResponse.ok) {
        throw new Error('Failed to get prediction');
      }
  
      const predictionResult = await predictionResponse.json();
  
      // Step 3: Display the prediction results (modify this part based on your requirements)
      console.log('Top 5 Products for Next Month:', predictionResult);
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Example call to getPrediction
  getPrediction();
  