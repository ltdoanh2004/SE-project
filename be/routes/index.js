import express from "express";
import userRoutes from "./user.js";
import adminRoutes from "./admin.js";
import productRoutes from "./product.js";

const router = express.Router();

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

router.use("/product", productRoutes);

export default router;
