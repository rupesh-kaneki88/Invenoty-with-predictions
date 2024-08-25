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
    price:{
      type: Number,
      required: true,
    },
    stock: {
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
    description: String,
  },
  { timestamps: true }
);


const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
