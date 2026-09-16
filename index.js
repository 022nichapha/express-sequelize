import express from "express";
import cors from "cors";
import { Product, connectDB } from "./db.js";

const app = express();

// 1. รับ PORT จาก Environment Variable ของ Render (ถ้าไม่มีให้ถอยไปใช้ 5000)
const PORT = process.env.PORT || 5000;

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
    if (!name || price === undefined) {
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

// Find by Id
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id needed!" }); // แก้ไขจุดที่ลบ .json
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not Found!" }); // แก้ไขจุดที่ลบ .json
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// อัปเดต Product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id needed!" });
    }
    const { name, price } = req.body;
    if (!name && price === undefined) {
      return res
        .status(400)
        .json({ message: "Name or Price required for update!" });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not Found!" }); // แก้ไขจุดที่ลบ .json
    }
    await product.update({
      name: name || product.name,
      price: price !== undefined ? Number(price) : product.price,
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id needed!" });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not Found!" }); // แก้ไขจุดที่ลบ .json
    }
    await product.destroy();
    return res.status(200).json({
      message: "product is deleted successfully",
      deleteProduct: product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. ผูก IP "0.0.0.0" เพื่อให้ภายนอกยิงเข้ามาหา Server ได้
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
});
