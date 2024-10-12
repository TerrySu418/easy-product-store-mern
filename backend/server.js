import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import path from "path";

const app = express();

const __dirname = path.resolve();

app.use(express.json()); //allow us to accept JSON data in the req.body

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in Fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/api/products", async (req, res) => {
  const product = req.body; //user will send this data

  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newProduct = new Product(product);
  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.put("/api/products/:_id", async (req, res) => {
  const _id = req.params._id; //user will send this data
  const product = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(_id, product, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error in update product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.delete("/api/products/:_id", async (req, res) => {
  const _id = req.params._id; // user will send this data

  if (!_id) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide id" });
  }
  try {
    await Product.findByIdAndDelete(_id);
    res.status(200).json({ success: true, message: "Product Delete" });
  } catch (error) {
    console.error("Error in Delete product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// console.log(process.env.MONGO_URI);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT; // or any other available port
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
