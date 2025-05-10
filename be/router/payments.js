import express from "express";
import { createMomoPayment,momoCallback, createZaloPayPayment, zaloPayCallback} from "../controllers/paymentsController.js";

const router = express.Router();

router.post("/momo/:orderID/transaction",createMomoPayment)

router.post("/momo/transaction/callback", momoCallback)

router.post("/zaloPay/:orderID/transaction",createZaloPayPayment)

router.post("/zaloPay/transaction/callback", zaloPayCallback)


export default router;