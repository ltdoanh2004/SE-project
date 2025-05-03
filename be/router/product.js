import express from "express";
import {getByJewelry,getProductById, deleteProductById,uploadProductFiles,addProduct,updateProduct,getProductReviews} from "../controllers/productController.js";

const router = express.Router();

router.get("/get-Jewelry", getByJewelry);

router.get("/:id", getProductById);

router.delete("/:id", deleteProductById);

router.post("", uploadProductFiles,addProduct);

router.put("/:id", uploadProductFiles, updateProduct);

router.get("/:productID/reviews", getProductReviews);

export default router;
