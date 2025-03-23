import express from "express";
import {getByJewelry,getProductById, deleteProductById,addProduct} from "../controllers/productController.js";

const router = express.Router();

router.get("/getByJewelry", getByJewelry);

router.get("/:id", getProductById);

router.delete("/delete/:id", deleteProductById);

router.post("/add", addProduct);

export default router;
