import express from "express";
import {createOrder,getAllOrderCustomer,getOrderCustomerById,getAllOrderAdmin,getOrderAdminById, doneOrDuct,getDeliveryOrders, shippedOrder,confirmReceivedOrder} from "../controllers/orderController.js";

const router = express.Router();

router.post("", createOrder);

router.get("/customer",getAllOrderCustomer)

router.get("/:orderID/customer", getOrderCustomerById);

router.get("/admin",getAllOrderAdmin)

router.get("/:orDuctID/customer", getOrderAdminById);

router.put("/:orDuctID/product/shipped", doneOrDuct);

router.get("/delivery", getDeliveryOrders);

router.put("/:orderID/shipped", shippedOrder);

router.put("/:orderID/confirm-received", confirmReceivedOrder);

export default router;