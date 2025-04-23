import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

//tạo tài khoản admin
export const register = async (req, res) => {
    try {
        const { email, password, userName, phoneNumber ,bankAccountNumber, bank} = req.body;
    
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
    
        // Tạo user mới với role "admin"
        const newUser = await User.create({
            email,
            password,
            userName,
            phoneNumber,
            role: "admin",
        });
    
        console.log(newUser.userID);

        // Tạo adminvới cùng userID
        await Admin.create({
            userID: newUser.userID,
            bankAccountNumber,
            bank,
        });
    
        // Tạo token
        const token = jwt.sign({ userID: newUser.userID, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
    
        // Trả về kết quả
        res.status(201).json({
            token,
            user: {
                userId: newUser.userID,
                userName: newUser.userName,
            }
        })
    
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAdminDetails = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        // Kiểm tra role và tìm admin
        const adminUser = await User.findOne({
            where: { userID, email, role: "admin" },
            attributes: ["userID", "userName", "email", "phoneNumber"],
            include: [{
                model: Admin,
                attributes: ["bankAccountNumber", "bank"]
            }]
        });

        if (!adminUser || role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        res.status(200).json({ admin: adminUser });
    } catch (error) {
        console.error("Get Admin Info Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAdminDetails = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ message: "Token required" });

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return res.status(403).json({ message: "Invalid token format" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        if (role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }

        const user = await User.findOne({ where: { userID, email } });
        const admin = await Admin.findOne({ where: { userID } });

        if (!user || !admin || user.role !== "admin") {
            return res.status(404).json({ message: "Admin not found" });
        }

        const { username, phoneNumber, bankAccountNumber, bank } = req.body;

        if (username) user.userName = username;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        if (bankAccountNumber) admin.bankAccountNumber = bankAccountNumber;
        if (bank) admin.bank = bank;

        await user.save();
        await admin.save();

        res.status(200).json({ message: "Admin info updated successfully" });
    } catch (err) {
        console.error("Update Admin Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteCustomerReviewByAdmin = async (req, res) => {
    try {
        const { reviewID } = req.params;
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        const user = await User.findOne({ where: { userID, email } });

        if (!user || role !== "admin" || user.role !== role) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Tìm review
        const review = await Review.findOne({ where: { reviewID } });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Tìm product mà review thuộc về
        const product = await Product.findOne({ where: { productID: review.productId } });
        if (!product) {
            return res.status(404).json({ message: "Product not found for this review" });
        }

        // Kiểm tra quyền sở hữu sản phẩm
        if (product.userID !== userID) {
            return res.status(403).json({ message: "You are not authorized to delete this review" });
        }

        // Xoá review
        await review.destroy();

        res.status(200).json({ message: "Review deleted successfully by admin" });

    } catch (error) {
        console.error("Error deleting review by admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};