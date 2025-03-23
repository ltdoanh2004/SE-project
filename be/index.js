import express from "express"; 
import dotenv from "dotenv";
import appRoute from "./routes/index.js";
import { connectToDatabase, sequelize } from "./DB/index.js";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT  || 5000 || 3000;
const HOST = process.env.HOST || "localhost";

app.use(express.json());
app.use("/data", appRoute);

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log("Database connected successfully!");

    await sequelize.sync({ alter: true }); 
    console.log("Models synchronized successfully!");

    app.listen(PORT, HOST,() => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Error occurred while starting the server:", err);
    process.exit(1);
  }
};

startServer();

// import express from "express";
// import dotenv from "dotenv";
// import appRoute from "./routes/index.js";
// import { connectToDatabase, sequelize } from "./DB/index.js";

// // new setup
// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import axios from "axios";
// import cors from "cors";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || "localhost";

// // Cấu hình middleware trước các route
// app.use(cors());
// app.use(express.json());

// // Đặt thư mục lưu trữ hình ảnh
// const uploadFolder = "./image/";

// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder, { recursive: true });
// }

// // Setup Multer để lưu file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadFolder);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp","model/gltf-binary"];
//   if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error("Invalid file type. Only JPG, PNG, GIF, WEBP are allowed!"), false);
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//       if (allowedTypes.includes(file.mimetype)) {
//           cb(null, true);
//       } else {
//           cb(new Error("Invalid file type"), false);
//       }
//   }
// });

// // API 1: Upload ảnh từ frontend
// app.post("/upload", upload.single("image"), (req, res) => {
//   if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//   }
//   res.json({ message: "Upload successful", imageUrl: `/image/${req.file.filename}` });
// });

// // API 2: Tải ảnh từ URL về server
// app.post("/download-image", async (req, res) => {
//   const { imageUrl } = req.body;

//   if (!imageUrl) {
//       return res.status(400).json({ message: "Image URL is required" });
//   }

//   try {
//       const response = await axios({
//           url: imageUrl,
//           method: "GET",
//           responseType: "stream",
//       });

//       const filename = Date.now() + "-" + path.basename(imageUrl);
//       const filePath = path.join(uploadFolder, filename);
//       const writer = fs.createWriteStream(filePath);

//       response.data.pipe(writer);

//       writer.on("finish", () => {
//           res.json({ message: "Download successful", imageUrl: `/image/${filename}` });
//       });

//       writer.on("error", (err) => {
//           res.status(500).json({ message: "Download failed", error: err.message });
//       });
//   } catch (error) {
//       res.status(500).json({ message: "Error downloading image", error: error.message });
//   }
// });

// // Cung cấp ảnh cho frontend qua /image/
// app.use("/image", express.static(uploadFolder));

// Thêm các route của bạn
app.use("/data", appRoute);

// Khởi tạo server và kết nối đến database
// const startServer = async () => {
//     try {
//         await connectToDatabase();
//         console.log("Database connected successfully!");

//         await sequelize.sync({ alter: true });
//         console.log("Models synchronized successfully!");

//         // Chỉ cần gọi app.listen ở đây
//         app.listen(PORT, HOST, () => {
//             console.log(`Server is running on http://${HOST}:${PORT}`);
//         });
//     } catch (err) {
//         console.error("Error occurred while starting the server:", err);
//         process.exit(1);
//     }
// };

// startServer();
