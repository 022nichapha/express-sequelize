import { Sequelize, DataTypes } from "sequelize";
import { Client, Pool, neonConfig } from "@neondatabase/serverless";
import pg from "pg";
import ws from "ws";
import dotenv from "dotenv";
import express from "express"; // 1. Import express เพิ่มเข้ามา

dotenv.config();

neonConfig.webSocketConstructor = ws;

// ผสาน Client/Pool ของ Neon เข้ากับ types ของ pg
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectModule: {
    Client,
    Pool,
    types: pg.types,
  },
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Neon PostgreSQL via WebSocket (Port 443)!!");
    await sequelize.sync();
    console.log("Table synchronized !");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};

// 2. สร้าง Express App และสั่งให้เปิด Port ตามที่ Server กำหนด
const app = express();
app.use(express.json());

// Health Check Endpoint เพื่อให้ PaaS ตรวจสอบสถานะ Server ได้
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ดึง PORT จาก Environment Variable (ถ้าไม่มีให้ถอยไปใช้ 5435 หรือ 3000)
const PORT = process.env.PORT || 5435;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB(); // เชื่อมต่อ Database หลังจาก Server บูตพอร์ตเรียบร้อยแล้ว
});

export { sequelize, Product, connectDB, app };
