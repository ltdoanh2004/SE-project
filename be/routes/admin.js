import express from "express";
import {register, getAdminDetails,updateAdminDetails, deleteCustomerReviewByAdmin} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", register);

router.get("", getAdminDetails);

router.put("", updateAdminDetails);

router.delete("/:reviewID/review", deleteCustomerReviewByAdmin);

export default router;