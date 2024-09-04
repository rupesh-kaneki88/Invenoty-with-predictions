const Product = require("../models/product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");

// Add Post
const addProduct = (req, res) => {
  console.log("req.body:", req.body);
  
  const requiredFields = ['name', 'sku', 'purchaseprice', 'finalprice', 'quantity', 'description'];
  const missingFields = requiredFields.filter(field => !Object.keys(req.body).includes(field));

  if (missingFields.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', details: missingFields });
  }

  const addProduct = new Product({
    userID: req.body.userId,
    name: req.body.name,
    sku: req.body.sku,
    purchaseprice: parseFloat(req.body.purchaseprice),
    finalprice: parseFloat(req.body.finalprice),
    stock: parseInt(req.body.quantity),
    height: parseFloat(req.body.height),
    width: parseFloat(req.body.width),
    length: parseFloat(req.body.length),
    tags: req.body.tags,
    description: req.body.description,
    margin: parseFloat(req.body.margin) || 0, // Allow margin to be optional and default to 0 if not provided
  });

  addProduct
    .save()
    .then((result) => {
      console.log("Product saved successfully");
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error("Error saving product:", err);
      res.status(500).send(err.message || 'An error occurred');
    });
};

// Get All Products
const getAllProducts = async (req, res) => {
  const findAllProducts = await Product.find({
    userID: req.params.userId,
  }).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllProducts);
};

// Get Total Liability
const totalLiability = async (req, res) => {
  try {
    // Initialize total sum
    let totalSum = 0;

    // Fetch all products for the given user
    const findAllProducts = await Product.find({
      userID: req.params.userId,
    }).sort({ _id: -1 });

    // Calculate total liability
    findAllProducts.forEach(product => {
      // Ensure purchaseprice and stock are treated as numbers
      const purchasePrice = parseFloat(product.purchaseprice) || 0;
      const stock = parseInt(product.stock, 10) || 0;
      const sum = purchasePrice * stock;
      totalSum += sum;
    });

    // Return the total sum
    res.json({ totalLiability: totalSum });
  } catch (error) {
    console.error("Error calculating total liability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  const deleteProduct = await Product.deleteOne(
    { _id: req.params.id }
  );
  const deletePurchaseProduct = await Purchase.deleteOne(
    { ProductID: req.params.id }
  );

  const deleteSaleProduct = await Sales.deleteOne(
    { ProductID: req.params.id }
  );
  res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        name: req.body.name,
        sku: req.body.sku,
        purchaseprice:req.body.purchaseprice,
        finalprice: req.body.finalprice,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
        stock: req.body.quantity,
        tags: req.body.tags,
        description: req.body.description,
      },
      { new: true }
    );
    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Products
const searchProduct = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const products = await Product.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(products);
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
  totalLiability,
};
