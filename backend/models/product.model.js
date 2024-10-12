import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true, //createAt, updateAt
  }
);

const Product = mongoose.model("Product", productSchema);
// products collection

export default Product;
