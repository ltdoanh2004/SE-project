import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const createDatabaseIfNotExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    const dbName = process.env.MYSQL_DATABASE_NAME;
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database ${dbName} checked/created successfully.`);

    await connection.end();
  } catch (err) {
    console.error("Error creating database:", err.message);
    throw err;
  }
};

// Khởi tạo Sequelize sau khi database tồn tại
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    port: process.env.MYSQL_PORT,
  }
);

const connectToDatabase = async () => {
  try {
    await createDatabaseIfNotExists(); // Chạy xong mới kết nối

    await sequelize.authenticate();
    console.log("MySQL Connection Successful");

    await sequelize.sync(); // Tạo bảng nếu chưa có
    console.log("Database synchronized (tables created/updated)");
  } catch (error) {
    console.error("Database Connection Error:", error.message);
    throw error;
  }
};

export { sequelize, connectToDatabase };
