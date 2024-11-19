import React from 'react';
import { Doughnut } from "react-chartjs-2";


const PredictionChart = ({ predictionData }) => {
  // Prepare data for the chart
  const chartData = {
    labels: predictionData.map(item => item.Product),
    datasets: [
      {
        label: "Predicted Sales",
        data: predictionData.map(item => item.PredictedSales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='flex-auto'>
      <h2>Predicted Sales for Next Month</h2>
      {/* <Doughnut data={chartData} /> */}
      <h1 className='text-center mt-12'><i>We are working on it...</i></h1>
    </div>
  );
};

export default PredictionChart;
