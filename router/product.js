const express = require("express");
const app = express();
const product = require("../controller/product");

// Add Product
app.post("/add", product.addProduct);

// Get All Products
app.get("/get/:userId", product.getAllProducts);

// Get Specific Products
app.get("/getByProduct/:productId", product.getProduct);

// Delete Selected Product Item
app.get("/delete/:id", product.deleteSelectedProduct);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Search Product
app.get("/:userId/search", product.searchProduct);

//total liability
app.get("/get/:userId/totalLiability",product.totalLiability)

//stock update
app.get("/get/:userId/stockUpdate",product.stockUpdate)

//product prediction
app.get("/get/prediction/",product.product_prediction)

// http://localhost:4000/api/product/search?searchTerm=fa

module.exports = app;
