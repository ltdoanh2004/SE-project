import express from "express"; 
import dotenv from "dotenv";
import appRoute from "./routes/index.js";
import { connectToDatabase, sequelize } from "./DB/index.js";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT  || 5000 || 3000;
const HOST = process.env.HOST || "localhost";

app.use(express.json());
app.use("/data", appRoute);

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
