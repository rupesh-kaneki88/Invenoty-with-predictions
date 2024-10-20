const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");
const Product = require("../models/product")

// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    StoreID: req.body.storeID,
    StockSold: req.body.stockSold,
    SaleDate: req.body.saleDate,
    TotalSaleAmount: req.body.totalSaleAmount,
  });

  addSale
    .save()
    .then((result) => {
      soldStock(req.body.productID, req.body.stockSold);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find({"userID": req.params.userID})
    .sort({ SaleDate: -1 })
    .populate("ProductID")
    .populate("StoreID"); // -1 for descending order
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async(req,res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({"userID": req.params.userID});
  salesData.forEach((sale)=>{
    totalSaleAmount += sale.TotalSaleAmount;
  })
  res.json({totalSaleAmount});

}

const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0)

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;

      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getPreviousWeekSales = async (req, res) => {
  try {
    const sales = await Sales.find(); // Fetch all sales (You can optimize with a query if needed)

    // Get the current date
    const currentDate = new Date();

    // Calculate the start and end of the previous week (assuming week starts on Sunday)
    const startOfPreviousWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 7));
    const endOfPreviousWeek = new Date(currentDate.setDate(startOfPreviousWeek.getDate() + 6));

    startOfPreviousWeek.setHours(0, 0, 0, 0); // Set to start of the day
    endOfPreviousWeek.setHours(23, 59, 59, 999); // Set to end of the day

    // Filter sales within the previous week
    const previousWeekSales = sales.filter((sale) => {
      const saleDate = new Date(sale.SaleDate); // Convert string to Date
      return saleDate >= startOfPreviousWeek && saleDate <= endOfPreviousWeek;
    });

    // Calculate total sales for the previous week
    const totalPreviousWeekSales = previousWeekSales.reduce((acc, sale) => acc + sale.TotalSaleAmount, 0);

    res.status(200).json({ totalPreviousWeekSales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getCurrentWeekSales = async (req, res) => {
  try {
    const sales = await Sales.find(); // Fetch all sales

    // Get the current date
    const currentDate = new Date();

    // Calculate the start of the current week (assuming the week starts on Sunday)
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day

    // Object to store product sales count
    const productSalesCount = {};

    // Filter sales within the current week and calculate total sales
    const currentWeekSales = sales.filter((sale) => {
      const saleDate = new Date(sale.SaleDate); // Convert string to Date
      return saleDate >= startOfWeek && saleDate <= new Date(); // Sales between start of week and today
    });

    let totalCurrentWeekSales = 0;

    // Calculate total sales for the current week and count units sold per product
    currentWeekSales.forEach((sale) => {
      totalCurrentWeekSales += sale.TotalSaleAmount;

      // Count the StockSold for each product
      if (!productSalesCount[sale.ProductID]) {
        productSalesCount[sale.ProductID] = sale.StockSold; // Start counting this product
      } else {
        productSalesCount[sale.ProductID] += sale.StockSold; // Add to existing count
      }
    });

    // Find the top-selling product
    let topSelling = null;
    let maxUnitsSold = 0;

    for (const product in productSalesCount) {
      if (productSalesCount[product] > maxUnitsSold) {
        maxUnitsSold = productSalesCount[product];
        topSelling = product;
      }
    }

    let topSellingProduct = null;

    // console.log("Id",topSelling)
    // If there's a top-selling product, fetch its details from the Product collection
    if (topSelling) {
      topSellingProduct = await Product.findById(topSelling); // Await the async call
    }

    // Respond with total sales, top-selling product, and units sold
    res.status(200).json({
      totalCurrentWeekSales,
      topSellingProduct: topSellingProduct.name || "No sales",
      unitsSold: maxUnitsSold,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};




module.exports = { addSales, getMonthlySales, getSalesData,  getTotalSalesAmount, getCurrentWeekSales, getPreviousWeekSales};
