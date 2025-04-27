import OpenAI from 'openai';
import dotenv from 'dotenv';
import Product from "../models/Product.js";
import { Op } from "sequelize";

// Load environment variables
dotenv.config();

// Cấu hình domain cho frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Log OpenAI configuration state
console.log("OpenAI Controller loaded!");
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log("Using frontend URL:", FRONTEND_URL);

// Initialize OpenAI client with more detailed error handling
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY is missing in environment variables!");
    console.error("Please make sure you have a .env file with OPENAI_API_KEY=your_key_here");
  } else if (process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
    console.error("ERROR: You need to replace 'your_openai_api_key_here' with an actual OpenAI API key");
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log("OpenAI client initialized successfully");
  }
} catch (error) {
  console.error("Error initializing OpenAI client:", error);
}

// Hàm lấy sản phẩm nổi bật từ database để cung cấp context cho AI
const getFeaturedProductsForContext = async (limit = 10) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "productID",
        "name",
        "jewelryType",
        "material",
        "collection",
        "brand",
        "price",
        "productDescription"
      ],
      order: [
        ['stockQuantity', 'DESC'],  // Ưu tiên sản phẩm còn nhiều hàng
        ['price', 'ASC']            // Sau đó sắp xếp theo giá tăng dần
      ],
      limit: limit
    });

    // Nếu không có sản phẩm, trả về sản phẩm mẫu
    if (products.length === 0) {
      return [
        {
          id: 1,
          name: "Nhẫn Vàng 18k",
          type: "nhẫn",
          material: "vàng",
          collection: "Trang Sức Đính Kim Cương",
          brand: "Fossils",
          price: 9700000,
          description: "Nhẫn vàng 18k với thiết kế tinh tế và sang trọng",
          url: `${FRONTEND_URL}/product/1`
        },
        {
          id: 2,
          name: "Dây Chuyền Bạc",
          type: "dây chuyền",
          material: "bạc",
          collection: "Trang Sức Đính CZ",
          brand: "Calvin Klein",
          price: 1250000,
          description: "Dây chuyền bạc thanh lịch và hiện đại",
          url: `${FRONTEND_URL}/product/2`
        },
        {
          id: 3,
          name: "Bông Tai Kim Cương",
          type: "bông tai",
          material: "vàng",
          collection: "Trang Sức Đính Kim Cương",
          brand: "Michael Kors",
          price: 15000000,
          description: "Bông tai kim cương tinh xảo dành cho những dịp đặc biệt",
          url: `${FRONTEND_URL}/product/3`
        }
      ];
    }

    return products.map(product => ({
      id: product.productID,
      name: product.name,
      type: product.jewelryType,
      material: product.material,
      collection: product.collection,
      brand: product.brand,
      price: parseFloat(product.price),
      description: product.productDescription?.substring(0, 100) || "",
      url: `${FRONTEND_URL}/product/${product.productID}`
    }));
  } catch (error) {
    console.error("Error getting featured products:", error);
    return [];
  }
};

// Helper function để tìm kiếm sản phẩm
const searchProductsHelper = async (type = null, material = null, priceRange = null, style = null) => {
  try {
    // Building where clause based on filters
    const whereClause = {};
    
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
      limit: 3 // Limit to 3 results as recommended
    });

    // Nếu không tìm thấy sản phẩm nào, trả về sản phẩm mẫu phù hợp với filters
    if (products.length === 0) {
      console.log("No products found in database, using sample data with filters:", { type, material, priceRange, style });
      
      // Tạo sản phẩm mẫu dựa trên filters
      const sampleProducts = [];
      
      // Nhẫn vàng
      if ((type === null || type === "nhẫn" || type === "ring") && 
          (material === null || material === "vàng" || material === "gold")) {
        sampleProducts.push({
          name: "Nhẫn Vàng 18k",
          description: "Nhẫn vàng 18k với thiết kế tinh tế và sang trọng, phù hợp cho các sự kiện đặc biệt và làm quà tặng ý nghĩa.",
          price: 9700000,
          link: `${FRONTEND_URL}/product/1`,
          image: "/image/products/nhan-vang-18k.jpg"
        });
      }
      
      // Nhẫn bạc
      if ((type === null || type === "nhẫn" || type === "ring") && 
          (material === null || material === "bạc" || material === "silver")) {
        sampleProducts.push({
          name: "Nhẫn Bạc 925",
          description: "Nhẫn bạc 925 thiết kế hiện đại, tinh tế và thanh lịch, phù hợp cho cả nam và nữ.",
          price: 1200000,
          link: `${FRONTEND_URL}/product/2`,
          image: "/image/products/nhan-bac-925.jpg"
        });
      }
      
      // Dây chuyền vàng
      if ((type === null || type === "dây chuyền" || type === "necklace") && 
          (material === null || material === "vàng" || material === "gold")) {
        sampleProducts.push({
          name: "Dây Chuyền Vàng 24k",
          description: "Dây chuyền vàng 24k với thiết kế tinh xảo, sang trọng và đẳng cấp.",
          price: 25000000,
          link: `${FRONTEND_URL}/product/3`,
          image: "/image/products/day-chuyen-vang-24k.jpg"
        });
      }
      
      // Dây chuyền bạc
      if ((type === null || type === "dây chuyền" || type === "necklace") && 
          (material === null || material === "bạc" || material === "silver")) {
        sampleProducts.push({
          name: "Dây Chuyền Bạc 925",
          description: "Dây chuyền bạc 925 thiết kế hiện đại, tinh tế và thanh lịch, phù hợp cho cả nam và nữ.",
          price: 2500000,
          link: `${FRONTEND_URL}/product/4`,
          image: "/image/products/day-chuyen-bac-925.jpg"
        });
      }
      
      // Bông tai kim cương
      if ((type === null || type === "bông tai" || type === "earring") && 
          (material === null || material === "vàng" || material === "gold")) {
        sampleProducts.push({
          name: "Bông Tai Kim Cương",
          description: "Bông tai kim cương với thiết kế tinh xảo, sang trọng và đẳng cấp.",
          price: 15000000,
          link: `${FRONTEND_URL}/product/5`,
          image: "/image/products/bong-tai-kim-cuong.jpg"
        });
      }
      
      // Nếu không có sản phẩm nào phù hợp, hiển thị mặc định
      if (sampleProducts.length === 0) {
        sampleProducts.push({
          name: "Nhẫn Vàng 18k",
          description: "Nhẫn vàng 18k với thiết kế tinh tế và sang trọng.",
          price: 9700000,
          link: `${FRONTEND_URL}/product/1`,
          image: "/image/products/nhan-vang-18k.jpg"
        });
        
        sampleProducts.push({
          name: "Dây Chuyền Bạc 925",
          description: "Dây chuyền bạc 925 thiết kế hiện đại và thanh lịch.",
          price: 2500000,
          link: `${FRONTEND_URL}/product/4`,
          image: "/image/products/day-chuyen-bac-925.jpg"
        });
      }
      
      return sampleProducts.slice(0, 3);
    }

    // Format response
    return products.map(product => ({
      name: product.name,
      description: product.productDescription,
      price: product.price,
      link: `${FRONTEND_URL}/product/${product.productID}`,
      image: product.images && product.images.length > 0 ? product.images[0] : null
    }));
  } catch (error) {
    console.error("Product search error:", error);
    return [];
  }
};

// Hàm xử lý tin nhắn với OpenAI
export const processMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validate message
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: "Message is required" 
      });
    }

    // Check if OpenAI client is properly initialized
    if (!openai) {
      console.error("OpenAI client not initialized. Check your API key configuration.");
      return res.status(500).json({
        success: false,
        message: "OpenAI service is currently unavailable. Please check server configuration."
      });
    }

    // Fetch featured products for context
    const featuredProducts = await getFeaturedProductsForContext(5);
    const productContext = featuredProducts.length > 0 
      ? `Here are some of our featured jewelry products that you can reference:
${featuredProducts.map(p => `- ID: ${p.id}, Name: "${p.name}", Type: ${p.type || 'N/A'}, Material: ${p.material || 'N/A'}, Price: $${p.price}, URL: ${p.url}, Description: ${p.description}`).join('\n')}`
      : "We currently don't have any featured products to recommend.";

    // Create messages for the conversation
    const systemPrompt = {
      role: "system", 
      content: `You are a professional e-commerce jewelry consultant AI embedded inside a jewelry website.

${productContext}

Your goals are:
- Understand the customer's emotions and needs based on their messages.
- Suggest specific jewelry products from our catalog when appropriate, referencing them by ID and name.
- Always include the full product URL (${FRONTEND_URL}/product/ID) when recommending products.
- Be friendly, empathetic, and persuasive like an experienced sales advisor.
- Keep your responses concise but helpful (2-3 sentences maximum).
- Use emojis sparingly to make the conversation lively (max 1-2 per message).
- Personalize your speech with "you" and "your" to make the customer feel important.

Important behaviors:
- Always include the clickable URL to product pages when recommending items (e.g., ${FRONTEND_URL}/product/1).
- Reference specific product IDs from our catalog when making recommendations.
- If the customer says the product is "too expensive", suggest lower-priced alternatives.
- If the customer seems excited, provide gentle encouragement.
- If the customer is hesitating, offer warm reassurance and propose alternatives.
- Always focus only on jewelry and the store, avoid unrelated topics.
- Your task is to understand their needs and extract ONLY these filters if present:
  - type: the type of jewelry (ring, necklace, bracelet, earring, etc.)
  - material: material of the jewelry (gold, silver, platinum, diamond, etc.)
  - priceRange: price range as [min, max] in numbers
  - style: style of jewelry (modern, classic, elegant, minimalist, etc.)

Return these filters in your response JSON for our product search system.

Your response MUST use the following JSON format:
{
  "text": "Your response to the customer here",
  "type": null or string,
  "material": null or string,
  "priceRange": null or array of two numbers,
  "style": null or string
}`
    };

    // Build conversation from history
    const messages = [
      systemPrompt,
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    console.log("Calling OpenAI API with messages:", JSON.stringify(messages.slice(-2)));

    // Call OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: "json_object" }
      });

      // Process response from OpenAI
      const aiResponse = completion.choices[0]?.message?.content || "{}";
      console.log("OpenAI API response:", aiResponse);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponse);
        
        // Check if the response has the expected text field
        if (!parsedResponse.text) {
          console.error("OpenAI response missing 'text' field:", aiResponse);
          parsedResponse = { 
            text: "Hello! How can I help you find the perfect jewelry piece today?",
            type: parsedResponse.type || null,
            material: parsedResponse.material || null,
            priceRange: parsedResponse.priceRange || null,
            style: parsedResponse.style || null
          };
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
        parsedResponse = { 
          text: "I'm here to help you find beautiful jewelry. What are you looking for today?",
          type: null,
          material: null,
          priceRange: null,
          style: null
        };
      }

      // Extract filters from AI response (if any)
      const filters = {
        type: parsedResponse.type || null,
        material: parsedResponse.material || null,
        priceRange: parsedResponse.priceRange || null,
        style: parsedResponse.style || null
      };

      // Search for products with suggested filters
      const products = await searchProductsHelper(
        filters.type,
        filters.material,
        filters.priceRange,
        filters.style
      );

      // Return response to frontend
      res.status(200).json({
        success: true,
        reply: parsedResponse.text,
        products: products,
        filters: filters
      });
      
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      
      // Handle different types of OpenAI errors
      if (openaiError.status === 401) {
        console.error("Authentication error: Check your OpenAI API key");
        return res.status(500).json({
          success: false,
          message: "OpenAI authentication failed. Please check your API key configuration.",
          error: "Authentication error"
        });
      }
      
      // Return general error for other API issues
      return res.status(500).json({
        success: false,
        message: "Error processing your message with AI service",
        error: openaiError.message
      });
    }

  } catch (error) {
    console.error("OpenAI Chatbot general error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing your message",
      error: error.message
    });
  }
}; 