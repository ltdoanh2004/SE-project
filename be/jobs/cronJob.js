import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import Token from "../models/Token.js";

// Tạo cron job để kiểm tra token hết hạn
const cronJob = () => {
    cron.schedule('* * * * *', async () => {  // '1 0 * * *' để chạy mỗi ngày lúc 00:01
        console.log('Checking for expired tokens...');

        try {
            // Lấy tất cả token từ DB
            const tokens = await Token.findAll(); // Thay thế với ORM của bạn

            // Duyệt qua các token
            for (let tokenRecord of tokens) {
                try {
                    // Giải mã token
                    jwt.verify(tokenRecord.token, process.env.JWT_SECRET);
                } catch (err) {
                    // Nếu không giải mã được thì token hết hạn hoặc không hợp lệ
                    console.log(`Token expired or invalid, deleting token with ID: ${tokenRecord.tokenID}`);
                    // Xóa token hết hạn
                    await Token.destroy({ where: { tokenID: tokenRecord.tokenID } });
                }
            }
        } catch (error) {
            console.error('Error checking expired tokens:', error);
        }
    });
};

export default cronJob;
