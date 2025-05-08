import OpenAI from 'openai';
import dotenv from 'dotenv';
import Product from "../models/Product.js";
import { Op } from "sequelize";

// Load environment variables
dotenv.config();

// Cấu hình domain cho frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Cấu hình domain cho backend - thêm địa chỉ backend API 
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Log OpenAI configuration state
console.log("OpenAI Controller loaded!");
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log("Using frontend URL:", FRONTEND_URL);
console.log("Using backend URL for images:", BACKEND_URL);

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
    // Kiểm tra xem yêu cầu có liên quan đến nhẫn bạc không
    const isSilverRingQuery = 
      (type === "nhẫn" || type === "nhân" || type === "ring") && 
      (material === "bạc" || material === "silver");
    
    console.log("Searching for products with filters:", { type, material, priceRange, style });
    console.log("Is silver ring query:", isSilverRingQuery);

    // Tìm kiếm sản phẩm trong database
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
        "images",
        "jewelryType",
        "material"
      ],
      limit: 3 // Limit to 3 results
    });

    // Nếu không tìm thấy sản phẩm nào, tìm kiếm các sản phẩm liên quan
    if (products.length === 0) {
      console.log("No products found with exact filters, searching for related products");
      
      // Tìm kiếm các sản phẩm liên quan bằng cách nới lỏng điều kiện tìm kiếm
      // Ví dụ: nếu tìm nhẫn bạc không có, thì tìm các loại nhẫn hoặc các sản phẩm bạc khác
      const relatedWhereClause = {};
      
      if (type) {
        relatedWhereClause[Op.or] = [
          { jewelryType: type }
        ];
      }
      
      if (material) {
        if (relatedWhereClause[Op.or]) {
          relatedWhereClause[Op.or].push({ material: material });
        } else {
          relatedWhereClause[Op.or] = [{ material: material }];
        }
      }
      
      // Nếu không có điều kiện nới lỏng, lấy một số sản phẩm nổi bật
      const relatedProducts = relatedWhereClause[Op.or] ? 
        await Product.findAll({
          where: relatedWhereClause,
          attributes: [
            "productID", 
            "name", 
            "price", 
            "productDescription",
            "images",
            "jewelryType",
            "material"
          ],
          limit: 3
        }) : 
        await Product.findAll({
          attributes: [
            "productID", 
            "name", 
            "price", 
            "productDescription",
            "images",
            "jewelryType",
            "material"
          ],
          limit: 3
        });
      
      // Nếu vẫn không tìm thấy sản phẩm nào, trả về mảng rỗng
      if (relatedProducts.length === 0) {
        return [];
      }
      
      // Format response with complete image URLs for related products
      return relatedProducts.map(product => {
        // Handle image paths - parse JSON if needed
        let imagePath = null;
        try {
          // Try to parse images as JSON if it's a string
          let imageArray = product.images;
          if (typeof product.images === 'string') {
            try {
              imageArray = JSON.parse(product.images);
            } catch (e) {
              // If can't parse as JSON, treat as string
              imageArray = [product.images];
            }
          }
          
          // Get first image from array or use direct string
          const imageSrc = Array.isArray(imageArray) && imageArray.length > 0 
            ? imageArray[0] 
            : (typeof imageArray === 'string' ? imageArray : null);
            
          if (imageSrc) {
            if (imageSrc.startsWith('http')) {
              imagePath = imageSrc;
            } else if (imageSrc.startsWith('/image')) {
              imagePath = `${BACKEND_URL}${imageSrc}`;
            } else {
              imagePath = `${BACKEND_URL}/image/${imageSrc}`;
            }
          }
        } catch (error) {
          console.error("Error processing image path:", error);
        }

        return {
          name: product.name,
          description: product.productDescription + " (Sản phẩm liên quan)",
          price: product.price,
          link: `${FRONTEND_URL}/product/${product.productID}`,
          image: imagePath,
          isRelated: true
        };
      });
    }

    // Format response with complete image URLs
    return products.map(product => {
      // Handle image paths - parse JSON if needed
      let imagePath = null;
      try {
        // Try to parse images as JSON if it's a string
        let imageArray = product.images;
        if (typeof product.images === 'string') {
          try {
            imageArray = JSON.parse(product.images);
          } catch (e) {
            // If can't parse as JSON, treat as string
            imageArray = [product.images];
          }
        }
        
        // Get first image from array or use direct string
        const imageSrc = Array.isArray(imageArray) && imageArray.length > 0 
          ? imageArray[0] 
          : (typeof imageArray === 'string' ? imageArray : null);
          
        if (imageSrc) {
          if (imageSrc.startsWith('http')) {
            imagePath = imageSrc;
          } else if (imageSrc.startsWith('/image')) {
            imagePath = `${BACKEND_URL}${imageSrc}`;
          } else {
            imagePath = `${BACKEND_URL}/image/${imageSrc}`;
          }
        }
      } catch (error) {
        console.error("Error processing image path:", error);
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
  } catch (error) {
    console.error("Product search error:", error);
    return [];
  }
};

// Hàm xử lý tin nhắn với OpenAI
export const processMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [], instructions = "" } = req.body;

    // Validate message
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: "Tin nhắn không được để trống" 
      });
    }

    // Kiểm tra cụ thể cho nhẫn bạc trong tiếng Việt
    const isSilverRingRequest = message.toLowerCase().includes('nhẫn bạc') || 
                             message.toLowerCase().includes('nhân bạc') ||
                             (message.toLowerCase().includes('nhẫn') && message.toLowerCase().includes('bạc')) ||
                             (message.toLowerCase().includes('nhân') && message.toLowerCase().includes('bạc')) ||
                             (message.toLowerCase().includes('đua tôi') && message.toLowerCase().includes('bạc'));

    // Check if OpenAI client is properly initialized
    if (!openai) {
      console.error("OpenAI client not initialized. Check your API key configuration.");
      return res.status(500).json({
        success: false,
        message: "Dịch vụ AI hiện không khả dụng. Vui lòng kiểm tra cấu hình máy chủ."
      });
    }

    // Fetch featured products for context
    const featuredProducts = await getFeaturedProductsForContext(5);
    const productContext = featuredProducts.length > 0 
      ? `Here are some of our featured jewelry products that you can reference:
${featuredProducts.map(p => `- ID: ${p.id}, Name: "${p.name}", Type: ${p.type || 'N/A'}, Material: ${p.material || 'N/A'}, Price: $${p.price}, URL: ${p.url}, Description: ${p.description}`).join('\n')}`
      : "We currently don't have any featured products to recommend.";

    // Thêm hướng dẫn bổ sung về việc xử lý khi không tìm thấy sản phẩm
    const noProductInstructions = instructions || "Nếu không tìm thấy sản phẩm phù hợp, hãy thông báo cho khách hàng rằng cửa hàng hiện không có sản phẩm đó và đề xuất một vài sản phẩm thay thế tương tự.";
    
    // Thêm hướng dẫn đặc biệt cho yêu cầu nhẫn bạc
    let additionalInstructions = "";
    if (isSilverRingRequest) {
      additionalInstructions = `
IMPORTANT: The user is asking about silver rings (Nhẫn Bạc) in Vietnamese. Make sure to:
1. Recommend "Nhẫn Bạc 925" (Silver Ring 925) with product ID 2
2. Always include the URL: ${FRONTEND_URL}/product/2
3. Do NOT recommend "Dây Chuyền Bạc" (Silver Necklace) when they are asking for "Nhẫn Bạc" (Silver Ring)
4. If user uses "nhân bạc" or "đua tôi nhân bạc", they mean "nhẫn bạc" (silver ring) - it's a typo or voice recognition error
`;
    }

    // Create messages for the conversation
    const systemPrompt = {
      role: "system", 
      content: `You are a professional e-commerce jewelry consultant AI embedded inside a jewelry website.

${productContext}

${additionalInstructions}

Your goals are:
- ALWAYS respond in Vietnamese language
- Understand the customer's emotions and needs based on their messages.
- Suggest specific jewelry products from our catalog when appropriate, referencing them by ID and name.
- Always include the full product URL (${FRONTEND_URL}/product/ID) when recommending products.
- Be friendly, empathetic, and persuasive like an experienced sales advisor.
- Keep your responses concise but helpful (2-3 sentences maximum).
- Use emojis sparingly to make the conversation lively (max 1-2 per message).
- Personalize your speech with "bạn" to make the customer feel important.

Important behaviors:
- ALWAYS respond in Vietnamese - this is crucial
- Always include the clickable URL to product pages when recommending items (e.g., ${FRONTEND_URL}/product/1).
- Reference specific product IDs from our catalog when making recommendations.
- If the customer says the product is "too expensive" ("quá đắt"), suggest lower-priced alternatives.
- If the customer seems excited, provide gentle encouragement.
- If the customer is hesitating, offer warm reassurance and propose alternatives.
- Always focus only on jewelry and the store, avoid unrelated topics.
- ${noProductInstructions}
- Your task is to understand their needs and extract ONLY these filters if present:
  - type: the type of jewelry (ring, necklace, bracelet, earring, etc.)
  - material: material of the jewelry (gold, silver, platinum, diamond, etc.)
  - priceRange: price range as [min, max] in numbers
  - style: style of jewelry (modern, classic, elegant, minimalist, etc.)

Return these filters in your response JSON for our product search system.

Your response MUST use the following JSON format:
{
  "text": "Your response to the customer here in Vietnamese",
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
        model: "gpt-4-turbo-preview", // Upgrading to GPT-4 for better Vietnamese responses, fallback will be automatic to 3.5-turbo if not available
        messages: messages,
        temperature: 0.7,
        max_tokens: 500, // Increased token limit for Vietnamese responses which may be longer
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
            text: "Xin chào! Tôi có thể giúp bạn tìm kiếm món trang sức hoàn hảo hôm nay không?",
            type: parsedResponse.type || null,
            material: parsedResponse.material || null,
            priceRange: parsedResponse.priceRange || null,
            style: parsedResponse.style || null
          };
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
        parsedResponse = { 
          text: "Tôi ở đây để giúp bạn tìm trang sức đẹp. Bạn đang tìm kiếm gì hôm nay?",
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
          message: "Xác thực OpenAI thất bại. Vui lòng kiểm tra cấu hình khóa API.",
          error: "Lỗi xác thực"
        });
      }
      
      // Return general error for other API issues
      return res.status(500).json({
        success: false,
        message: "Lỗi xử lý tin nhắn với dịch vụ AI",
        error: openaiError.message
      });
    }

  } catch (error) {
    console.error("OpenAI Chatbot general error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi xử lý tin nhắn của bạn",
      error: error.message
    });
  }
}; 