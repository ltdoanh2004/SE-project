import { Op } from "sequelize";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import User from "../models/User.js";
import OrDuct from "../models/OrDuct.js";

// new setup
import axios from "axios";
import fs from "fs";
import path from "path";

const uploadFolder = "public/uploads/"; // Thư mục lưu ảnh

dotenv.config();

export const getByJewelry = async (req, res) => {
    try {
        const { jewelryFit, jewelry, page } = req.query; // Dùng req.query thay vì req.body

        // Lấy thông tin phân trang từ request
        const pageNumber = parseInt(page?.number) || 1; // Mặc định trang 1
        const limitNumber = parseInt(page?.total) || 9; // Mặc định 9 sản phẩm/trang
        const offset = (pageNumber - 1) * limitNumber;

        // Khởi tạo điều kiện lọc sản phẩm
        const whereClause = {};

        if (jewelryFit) {
            whereClause.jewelryFit = jewelryFit;
        }

        if (jewelry) {
            if (jewelry.type) whereClause.jewelryType = jewelry.type;
            if (jewelry.material) whereClause.material = jewelry.material;
            if (jewelry.brand) whereClause.brand = jewelry.brand;
            if (jewelry.collection) whereClause.collection = jewelry.collection;
            if (jewelry.price && jewelry.price.min && jewelry.price.max) {
                whereClause.price = {
                    [Op.between]: [parseFloat(jewelry.price.min), parseFloat(jewelry.price.max)], // Lọc theo khoảng giá
                };
            }
        }

        // Tìm kiếm sản phẩm theo điều kiện với phân trang
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            attributes: ["productID", "name", "price", "images"], // Lựa chọn các trường cần thiết
            limit: limitNumber,
            offset: offset,
        });

        // Tính toán tổng số trang
        const totalPages = Math.ceil(count / limitNumber);

        // Format lại dữ liệu trả về
        const formattedProducts = rows.map((product) => ({
            id: product.productID,
            name: product.name,
            price: product.price,
            image: product.images || [], // Đảm bảo images là mảng
        }));

        // Trả về dữ liệu phân trang và sản phẩm
        res.json({
            page: {
                number: pageNumber,
                total: totalPages,
            },
            totalItems: count,
            products: formattedProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem id có phải là số hợp lệ không
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID does not exist" });
        }

        // Tìm sản phẩm theo ID
        const product = await Product.findByPk(id, {
            attributes: [
                "productID",
                "name",
                "brand",
                "collection",
                "jewelryFit",
                "material",
                "price",
                "productDescription",
                "images"
            ]
        });

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (!product) {
            return res.status(404).json({ message: "The product does not exist" });
        }

        // Format dữ liệu trả về
        res.json({
            id: product.productID,
            name: product.name,
            brand: product.brand,
            collection: product.collection,
            jewelryFit: product.jewelryFit,
            material: product.material,
            price: product.price,
            productDescription: product.productDescription,
            image: product.images ? product.images : []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const deleteProductById = async (req, res) => {
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

        // Kiểm tra user trong database
        const user = await User.findOne({ where: { userID, email } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.role !== "admin" || user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        // Lấy ID sản phẩm từ params
        const { id } = req.params;

        // Tìm tất cả các đơn hàng liên quan đến sản phẩm này
        const relatedOrDuct = await OrDuct.findAll({
            where: { productID: id },
            attributes: ["shipped"]
        });

        if (relatedOrDuct.length === 0) {
            // Không có đơn hàng liên quan, xóa sản phẩm
            await Product.destroy({ where: { productID: id } });
            return res.json({ message: "Product deleted successfully" });
        }

        // Kiểm tra trạng thái shipped của các đơn hàng
        const allShipped = relatedOrDuct.every(order => order.shipped === true);

        if (allShipped) {
            // Nếu tất cả các đơn hàng đều đã giao -> Xóa sản phẩm
            await Product.destroy({ where: { productID: id } });
            return res.json({ message: "Product deleted successfully" });
        } else {
            // Nếu còn đơn hàng chưa giao -> Đặt quantity về 0
            await Product.update({ quantity: 0 }, { where: { productID: id } });
            return res.json({ message: "Product quantity set to 0 due to pending orders" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const addProduct = async (req, res) => {
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

    // Kiểm tra user trong database
    const user = await User.findOne({ where: { userID, email } });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin" || user.role !== role) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const {
      name,
      jewelryFit,
      jewelryType,
      material,
      brand,
      collection,
      price,
      stockQuantity,
      productDescription,
      model3D,
      images,
      discount,
    } = req.body;

    if (!userID || !name || !jewelryFit || !price || !stockQuantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = await Product.create({
      userID,
      name,
      jewelryFit,
      jewelryType,
      material,
      brand,
      collection,
      price,
      stockQuantity,
      productDescription,
      model3D,
      images,
      discount,
    });

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const addProduct = async (req, res) => {
//   try {
//     // Lấy token từ header Authorization
//     const authHeader = req.headers["authorization"];
//     if (!authHeader) {
//       return res.status(401).json({ message: "Token required" });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token || token === "null") {
//       return res.status(403).json({ message: "Invalid token format" });
//     }

//     // Giải mã token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { userID, email, role } = decoded;

//     // Kiểm tra user trong database
//     const user = await User.findOne({ where: { userID, email } });
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (user.role !== "admin" || user.role !== role) {
//       return res.status(403).json({ message: "Forbidden: Admin access required" });
//     }

//     // Nhận dữ liệu sản phẩm từ request body
//     const {
//       name,
//       jewelryFit,
//       jewelryType,
//       material,
//       brand,
//       collection,
//       price,
//       stockQuantity,
//       productDescription,
//       model3D,
//       images,
//       discount,
//     } = req.body;

//     if (!userID || !name || !jewelryFit || !price || !stockQuantity) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const localImages = [];

//     // Kiểm tra nếu model3D là URL thì tải về
//     if (model3D && model3D.startsWith("http")) {
//         try {
//         const response = await axios({
//             url: model3D,
//             method: "GET",
//             responseType: "stream",
//         });

//         const filename = `${Date.now()}-${path.basename(model3D)}`;
//         const filePath = path.join(uploadFolder, filename);
//         const writer = fs.createWriteStream(filePath);

//         response.data.pipe(writer);

//         await new Promise((resolve, reject) => {
//             writer.on("finish", resolve);
//             writer.on("error", reject);
//         });

//         localModel3D = `/uploads/${filename}`; // Lưu đường dẫn mới
//         } catch (error) {
//         console.error("Failed to download model3D:", model3D, error.message);
//         }
//     }

//     // Tải từng ảnh từ URL về server
//     for (const imageUrl of images) {
//       try {
//         const response = await axios({
//           url: imageUrl,
//           method: "GET",
//           responseType: "stream",
//         });

//         const filename = `${Date.now()}-${path.basename(imageUrl)}`;
//         const filePath = path.join(uploadFolder, filename);
//         const writer = fs.createWriteStream(filePath);

//         response.data.pipe(writer);

//         await new Promise((resolve, reject) => {
//           writer.on("finish", resolve);
//           writer.on("error", reject);
//         });

//         localImages.push(`/uploads/${filename}`);
//       } catch (error) {
//         console.error("Failed to download image:", imageUrl, error.message);
//       }
//     }

//     // Tạo sản phẩm mới với ảnh đã tải về
//     const newProduct = await Product.create({
//       userID,
//       name,
//       jewelryFit,
//       jewelryType,
//       material,
//       brand,
//       collection,
//       price,
//       stockQuantity,
//       productDescription,
//       model3D,
//       images: localImages,
//       discount,
//     });

//     res.status(201).json({
//       message: "Product added successfully",
//       product: newProduct,
//     });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
