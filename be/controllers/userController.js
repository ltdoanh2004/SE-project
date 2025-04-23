import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import nodemailer from "nodemailer";
import Token from "../models/Token.js";

dotenv.config();

// Nodemailer gmail để gửi mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Hàm giải mã AES (ở fornend đã mã hóa mật khẩu trước khi gửi lên)
// const decryptData = (encryptedData) => {
//     try {
//         const decipher = crypto.createDecipheriv(
//         "aes-256-cbc",
//         Buffer.from(process.env.secretKey, "utf-8")
//         );
//         let decrypted = decipher.update(encryptedData, "base64", "utf-8");
//         decrypted += decipher.final("utf-8");
//         return decrypted;
//     } catch (error) {
//         console.error("encrypted error", error);
//         return null;
//     }
// };


// Đăng nhập và trả về JWT Token
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Giải mã mật khẩu từ client
        // const password = decryptData(encryptedPassword);

        // if (!password) {
        // return res.status(400).json({ message: "Error to decrypt" });
        // }

        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email or Password is incorrect" });
        }

        // So sánh mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email or Password is incorrect" });
        }

        //Tạo token
        const token = jwt.sign(
            { userID: user.userID, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Trả về kết quả theo format yêu cầu của frontend
        res.status(201).json({
            token,
            user: {
                userId: user.userID,
                userName: user.userName,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Đăng ký lấy lại mật khẩu
export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
    
        // Kiểm tra xem email có tồn tại không
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email not exit" });
        }
    
        // Tạo token xác nhận (có thời hạn 15 phút)
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Lưu token vào database
        const { tokenID } = await Token.create({ token });
    
        // Gửi email với link xác nhận
        const resetLink = `http://${process.env.HOST}:${process.env.PORT}/api/users/reset-password?tokenID=${tokenID}&token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Password Reset Confirmation",
            html: `
                <div style="max-width: 500px; margin: auto; padding: 20px; border: 2px solid #d4af37; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; background: #fff8e1;">
                    <h2 style="color: #b8860b;">🔒 Secure Your Account</h2>
                    <p style="color: #444;">We received a request to reset your password. If you initiated this request, please click the button below to proceed.</p>
                    
                    <a href="${resetLink}" style="display: inline-block; background:#d4af37; color: white; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold; margin-top: 10px;">
                        Reset Password
                    </a>

                    <p style="margin-top: 15px; font-size: 14px; color: #666;">If you did not request this, you can ignore this email. Your password will remain unchanged.</p>
                    
                    <hr style="border: none; border-top: 1px solid #d4af37; margin: 15px 0;">
                    
                    <p style="font-size: 12px; color: #888;">Shopping AI system✨</p>
                </div>
                `,
            };
          
    
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "The confirmation email has been sent, please check your inbox!" });
    
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Server error" });
    }
};
  
// Reset mật khẩu
export const resetPassword = async (req, res) => {
    try {
        const { tokenID, token } = req.query;

        console.log("Received tokenID:", tokenID);
        console.log("Received token:", token);
        if (!token || token === "null") {
            await Token.destroy({ where: { tokenID } });
            return showError(res, "Invalid or expired token!");
        }

        // 1. Tìm token trong DB
        const tokenRecord = await Token.findOne({ where: { tokenID } });

        if (!tokenRecord || tokenRecord.token !== token) {
            await Token.destroy({ where: { tokenID } });
            return showError(res, "Invalid or expired token!");
        }

        // 2. Xác thực JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // Token không hợp lệ hoặc đã hết hạn → xóa
            await Token.destroy({ where: { tokenID } });
            return showError(res, "Invalid or expired token!");
        }

        const email = decoded.email;

        // 3. Xóa token sau khi sử dụng
        await Token.destroy({ where: { tokenID } });

        // 4. Tạo mật khẩu mới ngẫu nhiên
        const newPassword = crypto.randomBytes(6).toString("hex");

        // 5. Mã hóa mật khẩu nếu bạn dùng bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 6. Cập nhật mật khẩu mới trong DB
        await User.update({ password: hashedPassword }, { where: { email } });

        // 7. Gửi mật khẩu mới qua email
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Your New Password",
            text: `Your new password is: ${newPassword}`,
        };

        await transporter.sendMail(mailOptions);

        // 8. Trả phản hồi thành công
        return res.send(`
            <html>
                <body>
                    <h2 style="color: green;">Your password has been reset successfully!</h2>
                    <p>Please check your email for the new password.</p>
                    <script> setTimeout(() => window.close(), 6000); </script>
                </body>
            </html>
        `);

    } catch (error) {
        console.error("Error resetting password:", error);
        return showError(res, "Error resetting password! Please try again later.");
    }
};

// Hàm hiển thị lỗi HTML
function showError(res, message) {
    return res.send(`
        <html>
            <body>
                <h2 style="color: red;">${message}</h2>
                <script> setTimeout(() => window.close(), 6000); </script>
            </body>
        </html>
    `);
}


//tạo tài khoản customer
export const register = async (req, res) => {
    try {
        const { email, password, userName, phoneNumber, address } = req.body;
    
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
    
        // Mã hóa mật khẩu (vì đã mã hóa trong model nên không cần)
        // const hashedPassword = await bcrypt.hash(password, 10);
    
        // Tạo user mới với role "customer"
        const newUser = await User.create({
            email,
            password,
            userName,
            phoneNumber,
            role: "customer",
        });
    
        // Tạo customer với cùng userID
        await Customer.create({
            userID: newUser.userID,
            address,
        });
    
        // tạo token
        const token = jwt.sign({ userID: newUser.userID, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
    
        // Trả về kết quả theo format yêu cầu của frontend
        res.status(201).json({
            token,
            user: {
                userId: newUser.userID,
                userName: newUser.userName,
            }
        });
    
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Lấy role của user
export const getRole = async (req, res) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers["authorization"];
        console.log("Received Authorization Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);

        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const { userID, email, role } = decoded;

        // Tìm user trong database
        const user = await User.findOne({ where: { userID, email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra role có khớp không
        if (user.role !== role) {
            return res.status(403).json({ message: "Role mismatch" });
        }

        // Trả về role nếu hợp lệ
        res.status(200).json({ 
            role: user.role 
        });

    } catch (error) {
        console.error("Get Role Error:", error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

// renew token
export const renewToken = async (req, res) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers["authorization"];
        console.log("Received Authorization Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);

        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const { userID, email, role } = decoded;

        // Tìm user trong database
        const user = await User.findOne({ where: { userID, email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Tạo token mới
        const newToken = jwt.sign(
            { userID: user.userID, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Trả về token mới
        res.status(200).json({ accessToken: newToken });

    } catch (error) {
        console.error("Renew Token Error:", error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        console.log("Received Authorization Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);

        if (!token || token === "null") {
            return res.status(403).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const { userID, email } = decoded;

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Missing old or new password" });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from old password" });
        }

        const user = await User.findOne({ where: { userID, email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        user.password = newPassword; // Mật khẩu mới đã được mã hóa trong model
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};