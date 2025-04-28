import express from "express";
import { searchProducts } from "../controllers/chatbotController.js";
import { processMessage } from "../controllers/openaiChatController.js";

const router = express.Router();

// Product search API for chatbot
router.post("/product-search", searchProducts);

// OpenAI chatbot API
router.post("/openai", processMessage);

export default router; 