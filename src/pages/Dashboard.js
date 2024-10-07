import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
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

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalLiability, setTotalLiability] = useState("")

  //for trends
  const [percentageChange, setPercentageChange] = useState(0);
  const [currentWeekSales, setCurrentWeekSales] = useState()
  const [previousWeekSales, setPreviousWeekSales] = useState()

    // Conditional styling based on positive or negative change
    const isPositive = percentageChange >= 0;
    const bgColor = isPositive ? 'bg-green-100' : 'bg-red-100';
    const textColor = isPositive ? 'text-green-600' : 'text-red-600';
    const iconPath = isPositive
      ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' // Upward trend for positive
      : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'; // Downward trend for negative


  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "series",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  // Update Chart Data
  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    });
  };

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchTotalLiability()
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
    fetchCurrentWeekSales()
    fetchPreviousWeekSales()
    getPrediction()
  }, []);

  useEffect(() => {
    if (previousWeekSales !== 0) {
      const change = ((currentWeekSales - previousWeekSales) / previousWeekSales) * 100;
      setPercentageChange(change);
    }
  }, [currentWeekSales, previousWeekSales]);

  //fetching weekly sales
  const fetchCurrentWeekSales = () =>{
    fetch(
      `http://localhost:4000/api/sales/get/${authContext.user}/getCurrentWeekSales`
    )
      .then((response) => response.json())
      .then((data) => setCurrentWeekSales(data.totalCurrentWeekSales));
  }

  const fetchPreviousWeekSales = () =>{
    fetch(
      `http://localhost:4000/api/sales/get/${authContext.user}/getPreviousWeekSales`
    )
      .then((response) => response.json())
      .then((data) => setPreviousWeekSales(data.totalPreviousWeekSales));
  }

  // Fetching total liability
  const fetchTotalLiability = () => {
    fetch(
      `http://localhost:4000/api/product/get/${authContext.user}/totalLiability`
    )
      .then((response) => response.json())
      .then((datas) => setTotalLiability(datas.totalLiability));
  };

  // Fetching total sales amount
  const fetchTotalSaleAmount = () => {
    fetch(
      `http://localhost:4000/api/sales/get/${authContext.user}/totalsaleamount`
    )
      .then((response) => response.json())
      .then((datas) => setSaleAmount(datas.totalSaleAmount));
  };

  // Fetching total purchase amount
  const fetchTotalPurchaseAmount = () => {
    fetch(
      `http://localhost:4000/api/purchase/get/${authContext.user}/totalpurchaseamount`
    )
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount));
  };

  // Fetching all stores data
  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setStores(datas));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setProducts(datas))
      .catch((err) => console.log(err));
  };

  // Fetching Monthly Sales
  const fetchMonthlySalesData = () => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((datas) => updateChartData(datas.salesAmount))
      .catch((err) => console.log(err));
  };

  // Function to fetch total sales data and make a prediction request
async function getPrediction() {
  try {
    // Step 1: Fetch total sales data from the get API
    const response = await fetch(`http://localhost:4000/api/sales/get/${authContext.user}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch sales data');
    }

    const salesData = await response.json();
    console.log("Sales data: ",salesData)

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

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4  p-4 ">
        <article className="flex flex-col gap-4 rounded-lg border  border-gray-100 bg-white p-6  ">
        <div className={`inline-flex gap-2 self-end rounded ${bgColor} p-1 ${textColor}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium">
              {Math.abs(percentageChange).toFixed(2)}%
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Sales
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
              &#8377;{saleAmount}
              </span>

              <span className="text-xs text-gray-500"> from &#8377;{totalLiability} </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col  gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Purchase
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                &#8377;{purchaseAmount}{" "}
              </span>

              {/* <span className="text-xs text-gray-500"> from &#8377;404.32 </span> */}
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Products
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {products.length}{" "}
              </span>

              {/* <span className="text-xs text-gray-500"> from $404.32 </span> */}
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Stores
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {stores.length}{" "}
              </span>

              {/* <span className="text-xs text-gray-500"> from 0 </span> */}
            </p>
          </div>
        </article>
        <div className="flex justify-around bg-white rounded-lg py-8 col-span-full justify-center">
          <div>
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              width="500"
            />
          </div>
          <div>
            {/* <Doughnut data={data} /> */}
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
