import { Sequelize, DataTypes } from "sequelize";

const isProduction = process.env.NODE_ENV === "production";
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: isProduction
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    })
  : new Sequelize(
      process.env.PGDATABASE || "product_db",
      process.env.PGUSER || "dev_user",
      process.env.PGPASSWORD || "dev_password",
      {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5433,
        dialect: "postgres",
        logging: false,
      },
    );

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
    console.log("Connected to PostgreSQL!!");
    await sequelize.sync();
    console.log("Table synchronized !");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};

export { sequelize, Product, connectDB };
