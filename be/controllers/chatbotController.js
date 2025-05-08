import { Op } from "sequelize";
import Product from "../models/Product.js";

// Configure frontend URL for product links
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Configure backend URL for image paths
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Search products API for chatbot
export const searchProducts = async (req, res) => {
  try {
    const { 
      query = "",
      type = null, 
      material = null, 
      priceRange = null, 
      style = null
    } = req.body;

    // Building where clause based on filters
    const whereClause = {};
    
    // Add text search
    if (query) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { productDescription: { [Op.like]: `%${query}%` } }
      ];
    }
    
    // Add jewelry type filter
    if (type) {
      whereClause.jewelryType = type;
    }
    
    // Add material filter
    if (material) {
      whereClause.material = material;
    }
    
    // Add price range filter
    if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
      whereClause.price = {
        [Op.between]: [parseFloat(priceRange[0]), parseFloat(priceRange[1])]
      };
    }
    
    // Add style filter (using collection or brand as proxy for style)
    if (style) {
      whereClause[Op.or] = [
        ...(whereClause[Op.or] || []),
        { collection: { [Op.like]: `%${style}%` } },
        { brand: { [Op.like]: `%${style}%` } }
      ];
    }

    // Find products matching criteria
    const products = await Product.findAll({
      where: whereClause,
      attributes: [
        "productID", 
        "name", 
        "price", 
        "productDescription",
        "images",
        "jewelryType",
        "material"
      ],
      limit: 5 // Limit to 5 results
    });

    if (products.length === 0) {
      // If no products found, return empty result with message
      return res.status(200).json({
        success: true,
        message: "Không tìm thấy sản phẩm phù hợp",
        products: []
      });
    }

    // Format response with complete image URLs
    const formattedProducts = products.map(product => {
      // Handle image paths
      let imagePath = null;
      if (product.images && product.images.length > 0) {
        // Check if the image path already starts with http or /image
        const imageSrc = product.images[0];
        if (imageSrc.startsWith('http')) {
          imagePath = imageSrc;
        } else if (imageSrc.startsWith('/image')) {
          imagePath = `${BACKEND_URL}${imageSrc}`;
        } else {
          imagePath = `${BACKEND_URL}/image/${imageSrc}`;
        }
      }

      return {
        name: product.name,
        description: product.productDescription,
        price: product.price,
        link: `${FRONTEND_URL}/product/${product.productID}`,
        image: imagePath,
        type: product.jewelryType,
        material: product.material
      };
    });

    res.status(200).json({
      success: true,
      products: formattedProducts
    });
  } catch (error) {
    console.error("Chatbot product search error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error searching products"
    });
  }
}; 