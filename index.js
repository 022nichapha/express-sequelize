import express from "express";
import cors from "cors";
import { Product, connectDB } from "./db.js";
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  return res.json("Server is running!");
});

// สร้าง Product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Name & Price are required fields!!" });
    }
    const newProduct = await Product.create({
      name: name,
      price: Number(price),
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Server error!", error);
    return res.status(500).json({ error: error.message });
  }
});

// ดูทั้งหมด
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//find by Id

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400)({ message: "Id needed!" });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404)({ message: "Product not Found!" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// อัพเดท Product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id needed!" });
    }
    const { name, price } = req.body;
    if (!name && !price) {
      return res
        .status(400)
        .json({ message: "Name & Price are required fields!!" });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404)({ message: "Product not Found!" });
    }
    await product.update({
      name: name || product.name,
      price: Number(price) || product.price,
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id needed!" });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404)({ message: "Product not Found!" });
    }
    await product.destroy();
    return res.status(200).json({
      massage: "product is deleted successfully",
      deleteProduct: product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
