import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

//tạo tài khoản admin
export const register = async (req, res) => {
    try {
        const { email, password, userName, phoneNumber ,bankAccountNumber, bank} = req.body;
    
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
    
        // Mã hóa mật khẩu (vì đã mã hóa trong model nên không cần)
        // const hashedPassword = await bcrypt.hash(password, 10);
    
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
