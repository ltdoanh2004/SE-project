import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BiSend } from 'react-icons/bi';
import { RiCloseLine } from 'react-icons/ri';
import { FaRegGem } from 'react-icons/fa';

// Sửa URL API - thay đổi port nếu cần
const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://your-backend-url.com';
const API_URL = `${BASE_URL}/api`;
console.log("ChatbotOpenAI Component Loaded!");
console.log("Using API URL:", API_URL);

// Chatbot component with OpenAI integration
const ChatbotOpenAI = ({ embedded = false }) => {
  console.log("ChatbotOpenAI rendering, embedded:", embedded);
  const [isOpen, setIsOpen] = useState(embedded || false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant',
      content: 'Hello! 👋 I\'m your jewelry consultant. How can I help you today?', 
      products: [] 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Show component is mounted
  useEffect(() => {
    console.log("ChatbotOpenAI mounted");
    return () => console.log("ChatbotOpenAI unmounted");
  }, []);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Format price to currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Process user message with OpenAI
  const processMessage = async (userMessage) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage, products: [] }]);
    setInput('');
    setIsTyping(true);
    
    try {
      console.log("Processing message:", userMessage);

      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log("Conversation history:", conversationHistory);
      console.log("Calling API at:", `${API_URL}/chatbot/openai`);

      // Call OpenAI API
      const response = await axios.post(`${API_URL}/chatbot/openai`, {
        message: userMessage,
        conversationHistory
      });

      console.log("API response:", response.data);

      const { reply, products, filters } = response.data;
      
      // Chỉ hiển thị sản phẩm khi người dùng yêu cầu (kiểm tra nội dung tin nhắn)
      const showProducts = userMessage.toLowerCase().includes('show') || 
                         userMessage.toLowerCase().includes('find') || 
                         userMessage.toLowerCase().includes('search') || 
                         userMessage.toLowerCase().includes('product') ||
                         userMessage.toLowerCase().includes('jewelry') ||
                         userMessage.toLowerCase().includes('recommend');
      
      // Add bot message with delay for realistic typing effect
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: reply, 
          products: showProducts ? (products || []) : [],
          filters
        }]);
        setIsTyping(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing message:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      
      // Fallback to simple response if API fails
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting to our product database right now. Please try again later or contact customer support for assistance.", 
          products: [] 
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    console.log("Submitting message:", input);
    processMessage(input);
  };

  // If embedded in another UI component
  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div 
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-black rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                }`}
              >
                {message.content}
              </div>
              
              {/* Product suggestions */}
              {message.products && message.products.length > 0 && (
                <div className="mt-2 grid gap-2">
                  {message.products.slice(0, 3).map((product, productIndex) => (
                    <a 
                      key={productIndex} 
                      href={product.link} 
                      className="block bg-white p-2 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left flex items-start"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.image && (
                        <div className="w-16 h-16 bg-gray-100 rounded mr-2 flex-shrink-0 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-secondary font-medium">{formatPrice(product.price)}</div>
                        <div className="text-xs text-gray-600 line-clamp-2">{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="mb-4">
              <div className="inline-block p-3 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-black px-3 py-2 rounded-r-lg hover:bg-secondary hover:text-white focus:outline-none"
            >
              <BiSend size={20} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Standalone chatbot with toggle
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat toggle button */}
      <button 
        onClick={toggleChat}
        className="flex items-center justify-center p-4 bg-yellow-500 hover:bg-yellow-600 text-black hover:text-white rounded-full shadow-lg transition-all duration-300"
      >
        {isOpen ? (
          <RiCloseLine size={24} />
        ) : (
          <FaRegGem size={24} />
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat header */}
          <div className="bg-yellow-500 text-black p-4 flex items-center">
            <FaRegGem size={20} className="mr-2" />
            <h3 className="font-semibold">Jeify Jewelry Consultant</h3>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div 
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-black rounded-tr-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
                
                {/* Product suggestions */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-2 grid gap-2">
                    {message.products.slice(0, 3).map((product, productIndex) => (
                      <a 
                        key={productIndex} 
                        href={product.link} 
                        className="block bg-white p-2 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left flex items-start"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {product.image && (
                          <div className="w-16 h-16 bg-gray-100 rounded mr-2 flex-shrink-0 overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-secondary font-medium">{formatPrice(product.price)}</div>
                          <div className="text-xs text-gray-600 line-clamp-2">{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="mb-4">
                <div className="inline-block p-3 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button 
                type="submit"
                className="bg-primary text-black px-3 py-2 rounded-r-lg hover:bg-secondary hover:text-white focus:outline-none"
              >
                <BiSend size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotOpenAI; 