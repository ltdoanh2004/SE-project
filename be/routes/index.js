import express from "express";
import userRoutes from "./user.js";
import adminRoutes from "./admin.js";
import productRoutes from "./product.js";
import customerRoutes from "./customer.js";
import orderRoutes from "./order.js";
import paymentsRoutes from "./payments.js";
import chatbotRoutes from "./chatbot.js";

const router = express.Router();

router.use("/users", userRoutes);

router.use("/admin", adminRoutes);

router.use("/product", productRoutes);

router.use("/customer",customerRoutes);

router.use("/order", orderRoutes);

router.use("/payments", paymentsRoutes);

router.use("/chatbot", chatbotRoutes);

export default router;
