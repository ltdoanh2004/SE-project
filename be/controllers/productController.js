import { Op } from "sequelize";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import OrDuct from "../models/OrDuct.js";
import Review from "../models/Review.js";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Lấy __dirname cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo folder nếu chưa tồn tại
const imageFolder = "data/images";
const modelFolder = "data/models";

[imageFolder, modelFolder].forEach(folder => {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// Các loại file cho phép
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedModelTypes = [
    "model/gltf-binary",
    "model/gltf+json",
    "application/octet-stream",         // GLB và FBX fallback
    "application/vnd.autodesk.fbx"
];

// Disk storage cho images & model
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "image1" || file.fieldname === "image2") {
            cb(null, imageFolder);
        } else if (file.fieldname === "model") {
            cb(null, modelFolder);
        } else {
            cb(new Error("Invalid field for file upload"), null);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, filename);
    }
});

// Memory storage cho product JSON
const memoryStorage = multer.memoryStorage();

// File filter chung
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "image1" || file.fieldname === "image2") {
        allowedImageTypes.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error("Invalid image file type"), false);
    } else if (file.fieldname === "model") {
        allowedModelTypes.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error("Invalid 3D model file type"), false);
    } else if (file.fieldname === "product") {
        cb(null, true); // file json dạng text
    } else {
        cb(new Error("Unknown fieldname"), false);
    }
};

// Tùy theo fieldname mà dùng đúng storage
const storageSelector = (req, file, cb) => {
    if (file.fieldname === "product") {
        memoryStorage._handleFile(req, file, cb);
    } else {
        diskStorage._handleFile(req, file, cb);
    }
};

// Hàm xóa file
const removeFile = (req, file, cb) => {
    if (file.fieldname === "product") {
        memoryStorage._removeFile(req, file, cb);
    } else {
        diskStorage._removeFile(req, file, cb);
    }
};

// Custom storage handler
const customStorage = { _handleFile: storageSelector, _removeFile: removeFile };

// Khởi tạo multer instance
const upload = multer({
    storage: customStorage,
    fileFilter
});

// Middleware export sẵn cho route
export const uploadProductFiles = upload.fields([
    { name: "product", maxCount: 1 }, // in memory
    { name: "image1", maxCount: 1 },  // to disk
    { name: "image2", maxCount: 1 },  // to disk
    { name: "model", maxCount: 1 }    // to disk
]);

export const deleteFile = (filePath) => {
    try {
        // Đảm bảo filePath bắt đầu bằng /image hoặc /models
        let actualPath;

        if (filePath.startsWith("/image/")) {
            // Đảm bảo đường dẫn bắt đầu từ thư mục "data/images"
            actualPath = path.join(__dirname, "..", "data", "images", path.basename(filePath));
        } else if (filePath.startsWith("/models/")) {
            // Đảm bảo đường dẫn bắt đầu từ thư mục "data/models"
            actualPath = path.join(__dirname, "..", "data", "models", path.basename(filePath));
        } else {
            console.warn("Unknown file path type:", filePath);
            return;
        }

        // Kiểm tra và xóa file nếu tồn tại
        if (fs.existsSync(actualPath)) {
            fs.unlinkSync(actualPath);
            console.log("Deleted:", actualPath);
        } else {
            console.warn("File not found:", actualPath);
        }
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
    }
};

const cleanupUploadedFiles = (files) => {
    const deleteIfExists = (filePath) => {
        if (!filePath) return;
        const fullPath = path.join(__dirname, "..", "data", filePath.includes("/image/")
            ? "images"
            : filePath.includes("/models/")
                ? "models"
                : "", path.basename(filePath));
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("🧹 Deleted:", fullPath);
        }
    };

    if (!files) return;

    if (files.image1?.[0]) deleteIfExists(`/image/${files.image1[0].filename}`);
    if (files.image2?.[0]) deleteIfExists(`/image/${files.image2[0].filename}`);
    if (files.model?.[0]) deleteIfExists(`/models/${files.model[0].filename}`);
};

// Lấy sản phẩm theo các điều kiện lọc
export const getByJewelry = async (req, res) => {
    try {
        const { jewelryFit, jewelry, page } = req.body;

        // Lấy thông tin phân trang
        const pageNumber = parseInt(page?.number) || 1; 
        const limitNumber = parseInt(page?.total) || 9; 
        const offset = (pageNumber - 1) * limitNumber;

        // Khởi tạo điều kiện lọc sản phẩm
        const whereClause = {};

        if (jewelryFit) whereClause.jewelryFit = jewelryFit;
        console.log("Where clause:", whereClause);

        if (jewelry) {
            if (jewelry.type) whereClause.jewelryType = jewelry.type;
            if (jewelry.material) whereClause.material = jewelry.material;
            if (jewelry.brand) whereClause.brand = jewelry.brand;
            if (jewelry.collection) whereClause.collection = jewelry.collection;
            if (jewelry.price) {
                if (jewelry.price.min && jewelry.price.max) {
                    // Cả min và max đều có
                    whereClause.price = {
                        [Op.between]: [
                            parseFloat(jewelry.price.min),
                            parseFloat(jewelry.price.max)
                        ],
                    };
                } else if (jewelry.price.min) {
                    // Chỉ có min
                    whereClause.price = {
                        [Op.gte]: parseFloat(jewelry.price.min),
                    };
                } else if (jewelry.price.max) {
                    // Chỉ có max
                    whereClause.price = {
                        [Op.lte]: parseFloat(jewelry.price.max),
                    };
                }
            }
        }

        // Tìm kiếm sản phẩm với phân trang
        const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        attributes: ["productID", "name", "price", "images","discount"], 
        limit: limitNumber,
        offset: offset,
        });

        // Tính toán tổng số trang
        const totalPages = Math.ceil(count / limitNumber);

        // Định dạng lại dữ liệu trả về
        const formattedProducts = rows.map((product) => ({
        id: product.productID,
        name: product.name,
        price: product.price,
        image: product.images || [],
        discount: product.discount || 0,
        }));

        res.status(200).json({
        page: { number: pageNumber, total: totalPages },
        totalItems: count,
        products: formattedProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Lấy thông tin sản phẩm theo ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
        return res.status(400).json({ message: "ID does not exist" });
        }

        const product = await Product.findByPk(id, {
        attributes: [
            "productID", "name", "brand", "collection", "jewelryFit", 
            "material", "price", "productDescription", "images"
        ]
        });

        if (!product) {
        return res.status(404).json({ message: "The product does not exist" });
        }

        res.status(200).json({
        id: product.productID,
        name: product.name,
        brand: product.brand,
        collection: product.collection,
        jewelryFit: product.jewelryFit,
        material: product.material,
        price: product.price,
        productDescription: product.productDescription,
        image: product.images || [],
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

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Tìm tất cả các đơn hàng liên quan đến sản phẩm này
        const relatedOrDuct = await OrDuct.findAll({
            where: { productID: id },
            attributes: ["shipped"]
        });

        // Nếu không có đơn hàng liên quan, xóa sản phẩm và các file ảnh/model
        if (relatedOrDuct.length === 0) {
            if (product.images && product.images.length > 0) {
                product.images.forEach(imagePath => deleteFile(imagePath));
            }

            if (product.model3D) {
                deleteFile(product.model3D);
            }

            await Product.destroy({ where: { productID: id } });
            return res.status(201).json({ message: "Product and associated files deleted successfully" });
        }

        // Kiểm tra trạng thái shipped
        const allShipped = relatedOrDuct.every(order => order.shipped === true);

        if (allShipped) {
            if (product.images && product.images.length > 0) {
                product.images.forEach(imagePath => deleteFile(imagePath));
            }

            if (product.model3D) {
                deleteFile(product.model3D);
            }

            await Product.destroy({ where: { productID: id } });
            return res.status(201).json({ message: "Product and associated files deleted successfully" });
        } else {
            await Product.update({ quantity: 0 }, { where: { productID: id } });
            return res.status(200).json({ message: "Product quantity set to 0 due to pending orders" });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
  
export const addProduct = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        // Kiểm tra token
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            cleanupUploadedFiles(req.files);
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token === "null"){
            cleanupUploadedFiles(req.files);
            return res.status(403).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        const user = await User.findOne({ where: { userID, email } });
        if (!user){
            cleanupUploadedFiles(req.files);
            return res.status(401).json({ message: "User not found" });
        }
        if (user.role !== "admin" || user.role !== role) {
            cleanupUploadedFiles(req.files);
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        // Parse JSON file gửi lên dưới tên "product"
        const productFile = req.files?.product?.[0];
        if (!productFile) {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({ message: "Missing 'product' file" });
        }

        let productData;
        try {
            const rawJson = productFile.buffer.toString("utf-8");
            productData = JSON.parse(rawJson);
        } catch (err) {
            cleanupUploadedFiles(req.files);
            console.error("JSON Parse Error:", err);
            return res.status(400).json({ message: "Invalid JSON format in 'product'" });
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
            discount,
        } = productData;

        // Validate fields
        if (!name || !jewelryFit || !price || !stockQuantity) {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({ message: "Missing required product fields" });
        }

        // Lấy image1, image2 và model
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const modelFile = req.files?.model?.[0];

        if (!image1 || !image2) {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({ message: "Both image1 and image2 are required" });
        }

        if (!modelFile) {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({ message: "Missing 3D model file" });
        }

        const imagePaths = [
            `/image/${image1.filename}`,
            `/image/${image2.filename}`
        ];

        const modelPath = `/models/${modelFile.filename}`;

        // Lưu vào DB
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
            discount: parseFloat(discount) || 0,
            images: imagePaths,
            model3D: modelPath,
        });

        return res.status(201).json({
            product: newProduct,
        });

    } catch (error) {
        console.error("Error adding product:", error);
        cleanupUploadedFiles(req.files); // Đảm bảo dọn rác luôn cả trong catch
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader){
            cleanupUploadedFiles(req.files);
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token === "null"){
            cleanupUploadedFiles(req.files);
            return res.status(403).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userID, email, role } = decoded;

        const user = await User.findOne({ where: { userID, email } });
        if (!user || user.role !== "admin" || user.role !== role) {
            cleanupUploadedFiles(req.files);
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        const { id } = req.params;

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findByPk(id);
        if (!product) {
            cleanupUploadedFiles(req.files); // Dọn nếu product không tồn tại
            return res.status(404).json({ message: "Product not found" });
        }

        // Parse JSON file (product)
        const productFile = req.files?.product?.[0];
        if (!productFile) {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({ message: "Missing 'product' file" });
        }

        let productData;
        try {
            const rawJson = productFile.buffer.toString("utf-8");
            productData = JSON.parse(rawJson);
        } catch (err) {
            cleanupUploadedFiles(req.files);
            console.error("JSON Parse Error:", err);
            return res.status(400).json({ message: "Invalid JSON format in 'product'" });
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
            discount,
        } = productData;

        // Validate minimal fields
        if (!name || !jewelryFit || !price || !stockQuantity) {
            cleanupUploadedFiles(req.files);
            return res.status(400).json({ message: "Missing required product fields" });
        }

        // Cập nhật ảnh nếu có
        const newImages = [];

        if (req.files.image1?.[0]) {
            deleteFile(product.images?.[0]);
            newImages.push(`/image/${req.files.image1[0].filename}`);
        } else if (product.images?.[0]) {
            newImages.push(product.images[0]);
        }

        if (req.files.image2?.[0]) {
            deleteFile(product.images?.[1]);
            newImages.push(`/image/${req.files.image2[0].filename}`);
        } else if (product.images?.[1]) {
            newImages.push(product.images[1]);
        }

        // Cập nhật model nếu có model mới
        let modelPath = product.model3D;
        if (req.files.model?.[0]) {
            deleteFile(product.model3D);
            modelPath = `/models/${req.files.model[0].filename}`;
        }

        // Cập nhật vào DB
        await product.update({
            name,
            jewelryFit,
            jewelryType,
            material,
            brand,
            collection,
            price,
            stockQuantity,
            productDescription,
            discount: parseFloat(discount) || 0,
            images: newImages,
            model3D: modelPath,
        });

        return res.status(201).json({ product });

    } catch (error) {
        // Dọn file nếu upload có nhưng gặp lỗi bất kỳ
        cleanupUploadedFiles(req.files);
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productID } = req.params;

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findByPk(productID);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Lấy toàn bộ đánh giá (bỏ reviewID)
        const reviews = await Review.findAll({
            where: { productId: productID },
            attributes: ["reviewID", "comment", "star"],
            include: [
              {
                model: Customer,
                attributes: [],
                include: [
                  {
                    model: User,
                    attributes: ["userName"],
                  }
                ]
              }
            ],
            order: [["star", "DESC"]],
          });

        return res.status(200).json({
            productID,
            reviews,
        });

    } catch (error) {
        console.error("Error fetching product reviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};