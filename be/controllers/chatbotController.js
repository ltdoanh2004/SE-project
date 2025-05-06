import { Op } from "sequelize";
import Product from "../models/Product.js";

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
        "images"
      ],
      limit: 5 // Limit to 5 results
    });

    // Format response
    const formattedProducts = products.map(product => ({
      name: product.name,
      description: product.productDescription,
      price: product.price,
      link: `/product/${product.productID}`,
      image: product.images && product.images.length > 0 ? product.images[0] : null
    }));

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