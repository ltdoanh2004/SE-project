import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import OrDuct from "../models/OrDuct.js";
import Pay from "../models/Pay.js";
import  Op  from "sequelize";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer gmail để gửi mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const createOrder = async (req, res) => {
    try {
        // Xác thực token
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

        const items = req.body.items; // [{ productId, quantity }]
        const { payType = "cash" } = req.body;

        const validPayTypes = ["cash", "bank-transfer"];
        if (!validPayTypes.includes(payType)) {
            return res.status(400).json({ message: "Invalid payment type" });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid or empty order items" });
        }

        let totalMoney = 0;
        const productsToUpdate = [];

        for (const item of items) {
            const { productId, quantity } = item;

            const product = await Product.findOne({ where: { productID: productId } });
            if (!product) {
                return res.status(404).json({ message: `Product ${productId} not found` });
            }

            if (product.stockQuantity < quantity) {
                return res.status(400).json({ message: `Not enough stock for product ${productId}. We only have ${product.stockQuantity} in stock.` });
            }

            const priceAfterDiscount = product.price * (1 - product.discount / 100);
            totalMoney += priceAfterDiscount * quantity;

            productsToUpdate.push({ product, quantity });
        }

        // Tạo đơn hàng
        const newOrder = await Order.create({
            userID,
            status: "processing",
            money: totalMoney,
            cancel: false,
            cancelReason: null
        });

        // Trừ kho và thêm vào bảng OrDuct
        for (const { product, quantity } of productsToUpdate) {
            product.stockQuantity -= quantity;
            await product.save();

            await OrDuct.create({
                orderID: newOrder.orderID,
                productID: product.productID,
                quantity,
                Shipped: false,
                price: product.price,
                discount: product.discount
            });
        }

        // Thêm record vào bảng Pay
        await Pay.create({
            orderID: newOrder.orderID,
            payDate: null,
            payType,
            money: totalMoney,
            isPaid: false
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Order Confirmation - Your Shopping Order",
            html: `
                <div style="max-width: 500px; margin: auto; padding: 20px; border: 2px solid #d4af37; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; background: #fff8e1;">
                    <h2 style="color: #b8860b;">🎉 Your Order Has Been Placed!</h2>
                    <p style="color: #444;">Thank you for shopping with us. Your order has been successfully placed, and we are processing it now.</p>
        
                    <h3 style="color: #b8860b;">Order Details:</h3>
                    <p style="color: #444;">Order ID: <strong>${newOrder.orderID}</strong></p>
                    <p style="color: #444;">Total Amount: <strong>${totalMoney.toFixed(0)} VNĐ</strong></p>
                    <p style="color: #444;">Payment Type: <strong>${payType.charAt(0).toUpperCase() + payType.slice(1)}</strong></p>
        
                    <h3 style="color: #b8860b;">Product Details:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr>
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Product Name</th>
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Quantity</th>
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Price</th>
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsToUpdate
                                .map(({ product, quantity }) => {
                                    const priceAfterDiscount = product.price * (1 - product.discount / 100);
                                    const totalProductPrice = priceAfterDiscount * quantity;
                                    return `
                                        <tr>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${quantity}</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${priceAfterDiscount.toFixed(0)} VNĐ</td>
                                            <td style="padding: 8px; border: 1px solid #ddd;">${totalProductPrice.toFixed(0)} VNĐ</td>
                                        </tr>
                                    `;
                                })
                                .join("")}
                        </tbody>
                    </table>
        
                    <p style="font-size: 12px; color: #888;">Thank you for choosing us! ✨</p>
                </div>
            `,
        };        
    
        try {
            // Gửi mail
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(201).json({ orderID: newOrder.orderID }, { message: "Failed to send confirmation order" });
        }

        return res.status(201).json({ orderID: newOrder.orderID });

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getAllOrderCustomer = async (req, res) => {
    try {
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

        // Lấy tất cả order của userID, join với Pay
        const orders = await Order.findAll({
            where: { userID },
            attributes: ["orderID", "date", "status", "cancel"], // Bỏ money ở đây
            include: [
                {
                    model: Pay,
                    attributes: ["money", "isPaid","payType"],
                }
            ],
            order: [["date", "DESC"]],
        });

        const formattedOrders = orders.map(order => ({
            orderID: order.orderID,
            date: order.date,
            paymentMethod: order.status,  
            cancel: order.cancel,
            isPaid: order.Pay.isPaid,
            money: Number(order.Pay.money),
            payStatus: order.Pay.payType
        }));

        return res.status(200).json({
            orders: formattedOrders
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getOrderCustomerById = async (req, res) => {
    try {
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

        const orderID = req.params.orderID;

        // Tìm order và join với Pay
        const order = await Order.findOne({
            where: { orderID, userID },
            attributes: ["orderID", "date", "status", "cancel", "cancelReason"],
            include: [
                {
                    model: Pay,
                    attributes: ["money", "isPaid","payType"]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Lấy sản phẩm từ OrDuct
        const orductItems = await OrDuct.findAll({
            where: { orderID },
            include: [
                {
                    model: Product,
                    attributes: ["productID", "name", "images", "model3D"]
                }
            ]
        });

        const products = orductItems.map(item => ({
            productID: item.Product.productID,
            name: item.Product.name,
            images: item.Product.images,
            model3D: item.Product.model3D,
            price: item.price,
            discount: item.discount,
            quantity: item.quantity,
            shipped: item.Shipped,
            total: Number((item.price * (1 - item.discount / 100)) * item.quantity)
        }));

        return res.status(200).json({
            order: {
                orderID: order.orderID,
                date: order.date,
                paymentMethod: order.status,               
                cancel: order.cancel,
                cancelReason: order.cancelReason,
                isPaid: order.Pay.isPaid,
                payStatus: order.Pay.payType,
                money: Number(order.Pay.money),
                products
            }
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getAllOrderAdmin = async (req, res) => {
    try {
        // Kiểm tra quyền của admin
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "admin" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        // Lọc các tham số truyền vào
        const { isPaid, shipped, startDate, endDate, payType } = req.query;

        // Điều kiện lọc cho OrDuct
        const orductWhere = {};
        if (shipped !== undefined) {
            orductWhere.Shipped = shipped === "true";
        }

        // Điều kiện lọc cho Order (không lọc theo status nữa)
        const orderWhere = {};
        if (startDate || endDate) {
            orderWhere.date = {
                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                ...(endDate ? { [Op.lte]: new Date(endDate) } : {})
            };
        }

        // Lọc thanh toán
        const payWhere = {};
        if (isPaid !== undefined) {
            payWhere.isPaid = isPaid === "true";
        }
        if (payType) {
            payWhere.payType = payType;  // Lọc theo payType
        }

        // Tìm các OrDuct chứa sản phẩm của admin này
        const orducts = await OrDuct.findAll({
            where: orductWhere,
            include: [
                {
                    model: Product,
                    where: { userID }, // Chỉ lấy sản phẩm thuộc admin hiện tại
                    attributes: ["productID"]
                },
                {
                    model: Order,
                    where: orderWhere,
                    attributes: ["orderID", "userID", "date", "status", "cancel", "cancelReason"],
                    include: [
                        {
                            model: Pay,
                            where: payWhere,
                            attributes: ["isPaid", "payType"]
                        }
                    ]
                }
            ],
            order: [
                [Order, "cancel", "ASC"], // Đơn chưa hủy trước
                ["Shipped", "ASC"], // Đơn chưa giao trước
                [Order, "date", "DESC"], // Mới nhất trước
                [Order, Pay, "payType", "ASC"] // Sắp xếp theo "processing", "on-delivery", "cancel"
            ]
        });

        // Định dạng dữ liệu trả về theo OrDuct
        const result = orducts.map(item => ({
            orDuctID: item.orDuctID,
            orderID: item.Order.orderID,
            productID: item.Product.productID,
            quantity: item.quantity,
            price: Number(item.price),
            discount: Number(item.discount),
            shipped: item.Shipped,

            // Thông tin đơn hàng
            date: item.Order.date,
            status: item.Order.status,
            cancel: item.Order.cancel,
            cancelReason: item.Order.cancelReason,

            // Thanh toán
            isPaid: item.Order.Pay?.isPaid ?? false,
            payType: item.Order.Pay?.payType ?? null,
            money: Number(item.Order.Pay?.money ?? 0)
        }));

        return res.status(200).json({ orducts: result });

    } catch (error) {
        console.error("Error fetching admin orders:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getOrderAdminById = async (req, res) => {
    try {
        const { orDuctID } = req.params; // Get the orDuctID from the URL parameters
        const authHeader = req.headers["authorization"];  // Get the token from the header

        // Check if token is provided
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];  // Get the token from the header

        // Check if token is valid
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        // Decode the token and verify user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        // Check if the user is an admin
        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "admin" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        // Fetch the OrDuct by orDuctID with the necessary relations and fields
        const orDuct = await OrDuct.findOne({
            where: { orDuctID },
            include: [
                {
                    model: Product,  // Include Product details
                    where: { userID },  // Only fetch products belonging to the current admin
                    attributes: ["productID", "name"]  // Specify the fields you need from Product
                },
                {
                    model: Order,  // Include Order details
                    include: [
                        {
                            model: Pay,  // Include Pay details
                            attributes: ["isPaid", "payType"]  // Specify the fields you need from Pay
                        }
                    ],
                    attributes: ["orderID", "userID", "date", "status", "cancel", "cancelReason"]  // Specify fields for Order
                }
            ],
            attributes: ["orDuctID", "quantity", "Shipped", "price", "discount"] // Include OrDuct specific fields
        });

        // If OrDuct is not found, return 404
        if (!orDuct) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Format the result
        const result = {
            orDuctID: orDuct.orDuctID,
            quantity: orDuct.quantity,
            Shipped: orDuct.Shipped,
            price: Number(orDuct.price),
            discount: Number(orDuct.discount),
            product: {
                productID: orDuct.Product.productID,
                name: orDuct.Product.name
            },
            order: {
                orderID: orDuct.Order.orderID,
                userID: orDuct.Order.userID,
                date: orDuct.Order.date,
                status: orDuct.Order.status,
                cancel: orDuct.Order.cancel,
                cancelReason: orDuct.Order.cancelReason,
                payment: {
                    isPaid: orDuct.Order.Pay.isPaid,
                    payType: orDuct.Order.Pay.payType
                }
            }
        };

        return res.status(200).json({ order: result });  // Send back the result

    } catch (error) {
        console.error("Error fetching order details:", error);  // Log any errors
        return res.status(500).json({ message: "Server error" });  // Return server error response
    }
};

export const doneOrDuct = async (req, res) => {
    try {
        const { orDuctID } = req.params;
        const authHeader = req.headers["authorization"];
    
        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }
    
        const token = authHeader.split(" ")[1];
    
        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email } = decoded;
    
        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }
    
        // Lấy thông tin OrDuct cùng với Product liên quan
        const orDuct = await OrDuct.findOne({
            where: { orDuctID },
            include: [
            {
                model: Product,
                attributes: ['productID', 'userID'],
            }
            ]
        });
    
        if (!orDuct) {
            return res.status(404).json({ message: "OrDuct not found" });
        }
    
        // Kiểm tra admin có phải chủ của product hay không
        if (orDuct.Product.userID !== userID) {
            return res.status(403).json({ message: "Forbidden: You do not own this product" });
        }
    
        // Cập nhật Shipped = true
        await orDuct.update({ Shipped: true });
    
        res.status(200).json({ message: `OrDuct ${orDuctID} marked as shipped` });
  
    } catch (error) {
        console.error("Error marking OrDuct as shipped:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDeliveryOrders = async (req, res) => {
    try {
        // Lấy tất cả đơn hàng đang xử lý và chưa bị huỷ
        const orders = await Order.findAll({
            where: {
            status: "processing",
            cancel: false,
            },
            include: [
            {
                model: OrDuct,
                include: [
                {
                    model: Product,
                    attributes: ['name'],
                },
                ],
            },
            {
                model: Pay,
                attributes: ['payType', 'isPaid', 'money'],
            },
            ],
        });
    
        // Lọc: chỉ giữ các đơn hàng có tất cả sản phẩm đã được shipped
        const filteredOrders = orders.filter(order => {
            return order.OrDucts.length > 0 &&
            order.OrDucts.every(duct => duct.Shipped === true);
        });
    
        const result = filteredOrders.map(order => ({
            orderID: order.orderID,
            date: order.date,
            products: order.OrDucts.map(duct => ({
            name: duct.Product?.name,
            quantity: duct.quantity,
            })),
            payType: order.Pay?.payType || null,
            isPaid: order.Pay?.isPaid || false,
            money: order.Pay?.money || 0,
        }));
    
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching delivery orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const shippedOrder = async (req, res) => {
    try {
        const { orderID } = req.params;
    
        const order = await Order.findOne({ where: { orderID } });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
    
        if (order.status !== "processing") {
            return res.status(400).json({ message: "Only orders with status 'processing' can be marked as 'shipped'" });
        }
    
        const orDucts = await OrDuct.findAll({
            where: { orderID },
            include: [{ model: Product }]
        });
    
        if (!orDucts || orDucts.length === 0) {
            return res.status(404).json({ message: "No products found for this order" });
        }
    
        const allShipped = orDucts.every(item => item.Shipped === true);
        if (!allShipped) {
            return res.status(400).json({ message: "Not all items are marked as shipped yet" });
        }
    
        // Kiểm tra và cập nhật thanh toán
        const pay = await Pay.findOne({ where: { orderID } });
        let paymentNote = "Order shipped successfully.";
    
        if (pay) {
            if (pay.payType === "cash") {
            if (!pay.isPaid) {
                await pay.update({
                isPaid: true,
                payDate: new Date()
                });
                paymentNote = `Order shipped. Customer paid ${pay.money} VND upon delivery.`;
            }
            } else if (pay.payType === "bank-transfer") {
            if (!pay.isPaid) {
                await pay.update({
                payType: "cash",
                isPaid: true,
                payDate: new Date()
                });
                paymentNote = `Order shipped. Customer will now pay ${pay.money} VND in cash (original bank transfer failed).`;
            }
            }
        }
    
        // Cập nhật trạng thái đơn hàng thành shipped
        await order.update({ status: "shipped" });

        // Tự động chuyển sang "done" sau 5 phút nếu khách chưa xác nhận
        setTimeout(async () => {
            try {
            const currentOrder = await Order.findOne({ where: { orderID } });
            if (currentOrder && currentOrder.status === "shipped") {
                await currentOrder.update({ status: "done" });
                console.log(`Order ${orderID} auto-marked as done after 5 minutes.`);
            }
            } catch (error) {
            console.error(`Error auto-marking order ${orderID} as done:`, error);
            }
        }, 5 * 60 * 1000); // 5 phút
    
        res.status(200).json({
            message: "Order marked as shipped.",
            paymentNote,
            payType: pay.payType,
            isPaid: pay.isPaid,
            money: pay.money
        });
  
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
  

export const confirmReceivedOrder = async (req, res) => {
    try {
        const { orderID } = req.params;
        const authHeader = req.headers["authorization"];
    
        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }
    
        const token = authHeader.split(" ")[1];
        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }
    
        // Decode token & xác minh người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email ,role} = decoded;
    
        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "customer" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }
    
        // Kiểm tra đơn hàng có thuộc về customer này không
        const order = await Order.findOne({ where: { orderID, userID } });
        if (!order) {
            return res.status(404).json({ message: "Order not found or does not belong to you" });
        }
    
        // Chỉ xác nhận nếu đơn đã shipped
        if (order.status !== "shipped") {
            return res.status(400).json({ message: "Order must be in 'shipped' status to confirm receipt" });
        }
    
        // Cập nhật trạng thái thành done
        await order.update({ status: "done" });
    
        res.status(200).json({ message: `Order ${orderID} has been marked as 'done'. Thank you for confirming!` });
    } catch (error) {
        console.error("Error confirming order receipt:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const cancelOrderByCustomer = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { cancelReason } = req.body;
    
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
    
        const order = await Order.findOne({ where: { orderID } });
        if (!order) return res.status(404).json({ message: "Order not found" });
    
        // Kiểm tra đơn có thuộc khách này không
        if (order.userID !== userID) {
            return res.status(403).json({ message: "You can only cancel your own orders" });
        }
    
        // Kiểm tra trạng thái không cho phép hủy
        if (order.status === "shipped" || order.status === "done") {
            return res.status(400).json({ message: `Cannot cancel an order with status '${order.status}'` });
        }
    
        // Nếu đã cancel trước đó
        if (order.status === "cancel" || order.cancel === true) {
            return res.status(400).json({ message: "Order is already canceled" });
        }
    
        // Cập nhật đơn hàng
        await order.update({
            cancel: true,
            cancelReason: cancelReason || "No reason provided",
            status: "cancel"
        });
    
        // Kiểm tra và thông báo hoàn tiền
        const pay = await Pay.findOne({ where: { orderID } });
    
        if (pay && pay.isPaid) {
            // Hoàn tiền nếu đã thanh toán
            // Giả lập hoàn tiền (thực tế sẽ cần tích hợp với hệ thống thanh toán nhưng không có api free hỗ trợ điều này)
            // await processRefund(pay.money); // Giả lập hoàn tiền
            return res.status(200).json({
            message: "Order canceled successfully. A refund will be processed.",
            refundAmount: pay.money
            });
        }
    
        res.status(200).json({
            message: "Order canceled successfully.",
        });
  
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};