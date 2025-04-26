import express from "express";
import { getCustomerCart , addToCart,removeFromCart,removeAllFromCart,updateCustomerDetails,getCustomerDetails,addReview, getCustomerReviewByProduct, deleteCustomerReviewByProduct} from "../controllers/customerController.js";

const router = express.Router();

router.get("/cart", getCustomerCart);

router.post("/cart/items", addToCart);

router.delete("/cart/items/:productID", removeFromCart);

router.delete("/cart/items", removeAllFromCart);

router.put("", updateCustomerDetails);

router.get("", getCustomerDetails);

router.post("/:productId/reviews", addReview);

router.get("/:productId/review", getCustomerReviewByProduct);

router.delete("/:productId/review", deleteCustomerReviewByProduct);

export default router;
