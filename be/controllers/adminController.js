import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// 1️⃣ Đăng nhập admin
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra admin có tồn tại không
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userID: admin.userID, email: admin.email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ accessToken: token, role: "admin" });
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 2️⃣ Lấy thông tin admin
export const getAdminInfo = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kiểm tra admin trong database
        const admin = await Admin.findOne({ where: { userID: decoded.userID } });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ userID: admin.userID, email: admin.email, role: "admin" });
    } catch (error) {
        console.error("Get Admin Info Error:", error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

// 3️⃣ Danh sách tất cả admin
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: ["userID", "email"],
        });
        res.json(admins);
    } catch (error) {
        console.error("Get All Admins Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
