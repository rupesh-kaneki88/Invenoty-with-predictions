const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sku:{
      type: String,
      required: true,
    },
    purchaseprice:{
      type: Number,
      required: true,
    },
    finalprice:{
      type: Number,
      required: true,
    },
    margin:{
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    length:{
      type: Number,
      required: true,
    },
    height:{
      type: Number,
      required: true,
    },
    width:{
      type: Number,
      required: true,
    },
    tags : {
      type: [String],
      required: false,
    },
    description: String,
  },
  { timestamps: true }
);


const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
