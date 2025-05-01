import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import OrDuct from "../models/OrDuct.js";
import Order from "../models/Order.js";

export const getCustomerCart = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Token required" });

    const token = authHeader.split(" ")[1];
    if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userID, email ,role} = decoded;

    const user = await User.findOne({ where: { userID, email } });
    if (!user || user.role !== "customer" || user.role !== role) {
        return res.status(403).json({ message: "Forbidden: Customer access required" });
    }

    const cart = await Cart.findAll({
        where: { userID: userID }, // Lọc giỏ hàng theo người dùng
        attributes: ["quantity"],  // Lấy mỗi quantity từ Cart
        include: [
            {
                model: Product,
                attributes: ["name", "price", "discount", "images", "model3D"], // Chỉ lấy các field cần từ Product
            }
        ]
    });
      

    if (!cart || cart.length === 0) {
      return res.status(200).json({cart: [] });
    }

    return res.status(200).json({
        cart: cart.map(item => ({
            quantity: item.quantity,
            product: {
                name: item.Product.name,
                price: item.Product.price,
                discount: item.Product.discount,
                images: item.Product.images,
                model3D: item.Product.model3D,
            }
        }))
      });
      

  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addToCart = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email ,role} = decoded;

        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "customer" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }
        
        const { productId, quantity } = req.body;
    
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Missing productId or quantity" });
        }
    
        // 1. Kiểm tra cart có tồn tại chưa
        let cart = await Cart.findOne({ where: { userID , productId} });
    
        let value = await Product.findOne({
            where: { productId },
            attributes: ['stockQuantity'],
        });

        if (!value) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. Nếu chưa có thì tạo mới
        if (!cart) {
            if (value.stockQuantity < quantity) {
                return res.status(400).json({ message: "Not enough stock" });
            }
            if (quantity <= 0) {
                return res.status(400).json({ message: "Quantity must be greater than 0" });
            }              
            cart = await Cart.create({ userID , productID: productId , quantity });
            return res.status(201).json({ message: "Product added to cart successfully" });
        }else {
            if (value.stockQuantity < (cart.quantity + quantity)) {
                return res.status(400).json({ message: "Not enough stock" });
            }

            if ((cart.quantity + quantity) <= 0) {
                await cart.destroy(); // Xóa sản phẩm khỏi giỏ hàng nếu số lượng bằng 0
                return res.status(200).json({ message: "Product removed from cart successfully" });
            }
            // 4. Nếu có rồi thì cập nhật số lượng
            cart.quantity += quantity;
            await cart.save();
            return res.status(200).json({ message: "Cart updated successfully" });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email ,role} = decoded;

        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "customer" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }
        
        const { productID} =  req.params;
    
        if (!productID) {
            return res.status(400).json({ message: "Missing productId" });
        }
    
        // 1. Kiểm tra cart có tồn tại chưa
        let cart = await Cart.findOne({ where: { userID , productId: productID} });

        if (!cart) {
            return res.status(404).json({ message: "Product not found in cart" });
        }else {
            await cart.destroy();
            return res.status(200).json({ message: "Product removed from cart successfully" });
        }
    } catch (error) {
        console.error("Error remove to cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeAllFromCart = async (req, res) => {
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

        // Xoá tất cả sản phẩm trong cart của userID
        const deletedCount = await Cart.destroy({ where: { userID } });

        if (deletedCount === 0) {
            return res.status(404).json({ message: "No products found in cart" });
        }

        return res.status(200).json({ message: "All products removed from cart successfully" });
    } catch (error) {
        console.error("Error removing cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateCustomerDetails = async (req, res) => {
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

    const { username, address, phoneNumber } = req.body;

    if (!username || !phoneNumber || !address) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Cập nhật bảng User
    const userUpdate = await User.update(
      {
        userName: username,
        phoneNumber: phoneNumber,
      },
      { where: { userID, email } }
    );

    // Cập nhật bảng Customer
    const customerUpdate = await Customer.update(
      { address },
      { where: { userID } }
    );

    return res.status(200).json({ message: "Customer details updated successfully" });
  } catch (error) {
    console.error("Error updating customer details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCustomerDetails = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });
    
        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;
    
        // Kiểm tra quyền
        const user = await User.findOne({
            where: { userID, email, role: role},
            attributes: ["userName", "email", "phoneNumber"],
            include: [{
            model: Customer,
            attributes: ["address"]
            }]
        });
    
        if (!user || role !== "customer") {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }
    
        return res.status(200).json({
            user: {
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.Customer?.address || null
            }
        });
  
    } catch (error) {
        console.error("Error fetching customer details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const addReview = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        // Xác thực user
        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "customer" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }

        const productId = req.params.productId;
        const { content, stars } = req.body;

        if (!content || !stars || stars < 1 || stars > 5) {
            return res.status(400).json({ message: "Invalid review content or stars" });
        }

        // 1. Lấy tất cả các đơn hàng của user
        const orders = await Order.findAll({ where: { userID } });
        const orderIDs = orders.map(order => order.orderID);

        if (orderIDs.length === 0) {
            return res.status(403).json({ message: "No orders found for user" });
        }

        // 2. Kiểm tra xem user đã nhận được sản phẩm này chưa
        const orduct = await OrDuct.findOne({
            where: {
                orderID: orderIDs,
                productID: productId,
                Shipped: true,
            }
        });

        if (!orduct) {
            return res.status(403).json({ message: "You haven't received this product yet" });
        }

        // 3. Kiểm tra đã review chưa
        const existingReview = await Review.findOne({
            where: { userId: userID, productId }
        });

        if (existingReview) {
            await Review.update(
                { comment: content, star: stars },
                { where: { userId: userID, productId } }
            );
            return res.status(200).json({ message: "Review updated successfully" });
        } else {
            await Review.create({
                userId: userID,
                productId: productId,
                comment: content,
                star: stars,
            });
            return res.status(201).json({ message: "Review added successfully" });
        }

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getCustomerReviewByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        // Kiểm tra user hợp lệ & là customer
        const user = await User.findOne({ where: { userID, email } });

        if (!user || user.role !== "customer" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }

        // Kiểm tra tồn tại Customer
        const customer = await Customer.findOne({ where: { userID } });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Kiểm tra review tồn tại với productID & userID
        const review = await Review.findOne({
            where: {
                productId,
                userId: userID
            }
        });

        if (!review) {
            return res.status(404).json({ message: "No review found for this product by this user" });
        }

        // Chỉ trả về reviewID
        res.status(200).json({
            reviewID: review.reviewID
        });

    } catch (error) {
        console.error("Error getting customer review by product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteCustomerReviewByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        // Kiểm tra user hợp lệ & là customer
        const user = await User.findOne({ where: { userID, email } });

        if (!user || user.role !== "customer" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Customer access required" });
        }

        // Kiểm tra review tồn tại
        const review = await Review.findOne({
            where: {
                productId,
                userId: userID
            }
        });

        if (!review) {
            return res.status(404).json({ message: "No review found to delete" });
        }

        // Xoá review
        await review.destroy();

        res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        console.error("Error deleting customer review by product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


