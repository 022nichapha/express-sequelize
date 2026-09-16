import { Sequelize, DataTypes } from "sequelize";
import { Client, Pool, neonConfig } from "@neondatabase/serverless";
import pg from "pg";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();

neonConfig.webSocketConstructor = ws;

// ผสาน Client/Pool ของ Neon เข้ากับ types ของ pg
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectModule: {
    Client,
    Pool,
    types: pg.types, // ใส่ types เพิ่มแก้ error getTypeParser
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

export { sequelize, Product, connectDB };
