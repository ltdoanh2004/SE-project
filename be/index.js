import express from "express"; 
import dotenv from "dotenv";
import appRouter from "./router/index.js"; 
import { connectToDatabase, sequelize } from "./DB/index.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cronJob from './jobs/cronJob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); 

const app = express();
const PORT = process.env.PORT  || 5000 || 3000;
const HOST = process.env.HOST || "localhost";

app.use(cors());
app.use(express.json());
app.use("/api", appRouter);
app.use("/image", express.static(path.join(__dirname, "data", "images")));
app.use("/models", express.static(path.join(__dirname, "data", "models")));

cronJob();

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log("Database connected successfully!");

    await sequelize.sync({ alter: true }); 
    console.log("Models synchronized successfully!");

    app.listen(PORT, HOST,() => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Error occurred while starting the server:", err);
    process.exit(1);
  }
};

startServer();
