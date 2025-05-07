import axios from 'axios';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Pay from '../models/Pay.js';
import dotenv from "dotenv";
import CryptoJS from 'crypto-js';
import moment from 'moment';

dotenv.config();

// MoMo payment configuration
const accessKey_momo = process.env.MOMO_ACCESS_KEY;
const secretKey_momo = process.env.MOMO_SECRET_KEY;

// ZaloPay payment configuration
const zaloPay_app = process.env.ZALOPAY_APP_ID;
const zaloPay_key1 = process.env.ZALOPAY_KEY1;
const zaloPay_key2 = process.env.ZALOPAY_KEY2;

// Redirect URL after payment
const redirectUrl = process.env.REDIRECT_URL;

//BE public URL
const bePublicUrl = process.env.BE_PUBLIC_URL;

export const createMomoPayment = async (req, res) => {
    try {
        // Kiểm tra token từ header
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        // Giải mã token và lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        // Kiểm tra người dùng có phải là "customer" không
        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "customer" || user.role !== role) {
        return res.status(403).json({ message: "Forbidden: Customer access required" });
        }

        // Lấy orderID từ URL parameters
        const { orderID } = req.params;

        // Kiểm tra đơn hàng có thuộc về người dùng không
        const order = await Order.findOne({
        where: { orderID, userID: userID } // Đảm bảo đơn hàng thuộc về user
        });

        if (!order) {
        return res.status(404).json({ message: "Order not found or doesn't belong to the customer" });
        }

        // Kiểm tra trạng thái đơn hàng có cho phép thanh toán không
        if (order.status === "done" || order.status === "shipped" || order.status === "cancel") {
        return res.status(400).json({ message: "Cannot create payment for completed or cancelled orders" });
        }

        // Kiểm tra thông tin thanh toán đã tồn tại hay chưa
        const pay = await Pay.findOne({ where: { orderID } });

        if (!pay) {
        return res.status(404).json({ message: "Payment information not found" });
        }

        // Kiểm tra số tiền thanh toán có khớp với đơn hàng không
        if (pay.money !== order.money) {
        return res.status(400).json({ message: "Payment amount does not match order amount" });
        }

        // Kiểm tra trạng thái thanh toán
        if (pay.isPaid) {
        return res.status(400).json({ message: "Order has already been paid" });
        }

        // Nếu payType là "cash", chuyển đổi thành "bank-transfer"
        if (pay.payType === "cash") {
        pay.payType = "bank-transfer";
        await pay.save(); // Lưu lại thay đổi
        }

        // Tạo yêu cầu thanh toán qua MoMo
        const orderInfo = 'pay with MoMo';
        const partnerCode = 'MOMO';
        const ipnUrl = `${bePublicUrl}/api/payments/momo/transaction/callback`;  // Địa chỉ URL để nhận thông báo từ MoMo về trạng thái thanh toán
        const requestType = "payWithMethod";
        const amount = order.money; // Sử dụng số tiền trong đơn hàng
        const orderId = partnerCode + new Date().getTime(); // Tạo orderId duy nhất
        const requestId = orderID; // Sử dụng orderID từ đơn hàng
        const extraData = new Date().toISOString(); // Optional
        const lang = 'vi';

        // Tạo raw signature
        const rawSignature = `accessKey=${accessKey_momo}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        // Tạo signature bằng HMAC SHA256
        const signature = crypto.createHmac('sha256', secretKey_momo)
        .update(rawSignature)
        .digest('hex');

        // Tạo đối tượng JSON gửi lên MoMo
        const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: true, // Tự động xử lý thanh toán
        extraData: extraData,
        signature: signature
        });

        // Gửi yêu cầu thanh toán đến MoMo sử dụng axios
        const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody
        };

        const response = await axios(options);

        // Kiểm tra kết quả từ MoMo
        if (response.data.resultCode === 0) {
        return res.status(200).json({ message: "Payment created successfully", paymentUrl: response.data.payUrl });
        } else {
        return res.status(500).json({ message: "Failed to create payment", error: response.data.errorMessage });
        }

    } catch (error) {
        console.error("Error creating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const momoCallback = async (req, res) => {
    try {
        const {
            requestId,
            amount,
            resultCode,
            extraData
        } = req.body;

        console.log("Momo Callback Response:", req.body);
        if (resultCode !== 0) {
            const message = { message: "Payment not successful" };
            console.log("⛔ Momo Callback Response:", 400, message);
            return res.status(400);
        }

        const orderID = parseInt(requestId.replace('MOMO', ''));
        const pay = await Pay.findOne({ where: { orderID } });

        if (!pay) {
            const message = { message: "Payment record not found" };
            console.log("⛔ Momo Callback Response:", 404, message);
            return res.status(404);
        }

        console.log("Money :", pay.money, "Amount :", amount);
        if (Number(amount) !== Number(pay.money)) {
            const message = { message: "Invalid payment amount" };
            console.log("⛔ Momo Callback Response:", 400, message);
            return res.status(400);
        }

        pay.isPaid = true;
        pay.payDate = new Date(extraData);
        await pay.save();

        const successMessage = { message: "Payment updated successfully" };
        console.log("✅ Momo Callback Response:", 200, successMessage);
        return res.status(200);

    } catch (error) {
        const errMessage = { message: "Internal server error" };
        console.log("❌ Momo Callback Response:", 500, errMessage);
        return res.status(500).json(errMessage);
    }
};

export const createZaloPayPayment = async (req, res) => {
    try {
        // 1. Kiểm tra token
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "customer" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }

        // 2. Lấy orderID từ URL
        const { orderID } = req.params;

        const order = await Order.findOne({ where: { orderID, userID } });
        if (!order) {
            return res.status(404).json({ message: "Order not found or doesn't belong to the customer" });
        }

        if (["done", "shipped", "cancel"].includes(order.status)) {
            return res.status(400).json({ message: "Cannot create payment for completed or cancelled orders" });
        }

        const pay = await Pay.findOne({ where: { orderID } });
        if (!pay) {
            return res.status(404).json({ message: "Payment information not found" });
        }

        if (pay.money !== order.money) {
            return res.status(400).json({ message: "Payment amount does not match order amount" });
        }

        if (pay.isPaid) {
            return res.status(400).json({ message: "Order has already been paid" });
        }

        if (pay.payType === "cash") {
            pay.payType = "bank-transfer";
            await pay.save();
        }

        // 3. Cấu hình ZaloPay
        const config = {
            app_id: zaloPay_app,
            key1: zaloPay_key1,
            endpoint: "https://sb-openapi.zalopay.vn/v2/create",
        };

        const embed_data = {
            redirectUrl : redirectUrl,
            orderID : orderID,
        };
        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);
        const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
        const app_time = Date.now();
        const amount = order.money;

        const data = [
            config.app_id,
            app_trans_id,
            "user123",
            amount,
            app_time,
            JSON.stringify(embed_data),
            JSON.stringify(items)
        ].join("|");

        const mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const orderData = {
            app_id: config.app_id,
            app_trans_id: app_trans_id,
            app_user: "user123",
            app_time: app_time,
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: amount,
            description: `ZaloPay - Payment for order #${orderID}`,
            bank_code: "",
            mac: mac,
            callback_url: `${bePublicUrl}/api/payments/zaloPay/transaction/callback`,
        };

        // 4. Gửi yêu cầu đến ZaloPay
        const response = await axios.post(config.endpoint, orderData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const order_url = response.data.order_url;
        if (!order_url) {
            console.log("ZaloPay response:", response.data);
            return res.status(500).json({ message: "ZaloPay did not return payment URL" });
        }

        return res.status(200).json({
            message: "Payment created successfully",
            order_url: order_url
        });

    } catch (error) {
        console.error("Error creating ZaloPay payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const zaloPayCallback = async (req, res) => {
    try {
        const dataStr = req.body.data;
        const reqMac = req.body.mac;

        const mac = CryptoJS.HmacSHA256(dataStr, zaloPay_key2).toString();

        console.log("ZaloPay mac:", mac);
        console.log("ZaloPay Callback MAC:", reqMac);

        if (reqMac !== mac) {
            const response = {
                return_code: -1,
                return_message: "mac not equal"
            };
            console.log("⛔ ZaloPay Callback: MAC mismatch");
            return res.status(400).json(response);
        }

        const data = JSON.parse(dataStr);
        const orderID = JSON.parse(data.embed_data).orderID;
        const app_time = data.app_time;

        console.log(data);

        const pay = await Pay.findOne({ where: { orderID } });
        if (!pay) {
            const response = {
                return_code: -2,
                return_message: "Order not found"
            };
            console.log("⛔ ZaloPay Callback: Order not found with ID", orderID);
            return res.status(404).json(response);
        }

        if(Number(pay.money) !== Number(data.amount)) {
            const response = {
                return_code: -3,
                return_message: "Invalid payment amount"
            };
            console.log("⛔ ZaloPay Callback: Invalid payment amount for order", orderID);
            return res.status(400).json(response);
        }

        pay.isPaid = true;
        pay.payDate = app_time;
        await pay.save();

        const response = {
            return_code: 1,
            return_message: "success"
        };
        console.log("✅ ZaloPay Callback: Payment updated for order", orderID);
        return res.status(200).json(response);

    } catch (error) {
        const response = {
            return_code: 0,
            return_message: error.message
        };
        console.error("❌ ZaloPay Callback Error:", error);
        return res.status(500).json(response); // ZaloPay sẽ retry nếu mã lỗi không phải 1
    }
};