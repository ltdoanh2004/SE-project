import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BiSend } from 'react-icons/bi';
import { RiCloseLine } from 'react-icons/ri';
import { FaRegGem } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Chatbot component
const Chatbot = ({ embedded = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: 'Hello! 👋 I\'m your jewelry consultant. How can I help you find the perfect piece today?', 
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

  // Product search API call
  const searchProducts = async (query, filters = {}) => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/product-search`, {
        query,
        ...filters
      });
      return response.data.products;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };

  // Process user message and generate response
  const processMessage = async (userMessage) => {
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage, products: [] }]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Basic intent detection
      const lowercaseMsg = userMessage.toLowerCase();
      let botResponse = '';
      let products = [];
      let filters = {};

      // Detect jewelry type
      if (lowercaseMsg.includes('ring')) {
        filters.type = 'ring';
      } else if (lowercaseMsg.includes('necklace')) {
        filters.type = 'necklace';
      } else if (lowercaseMsg.includes('bracelet')) {
        filters.type = 'bracelet';
      } else if (lowercaseMsg.includes('earring')) {
        filters.type = 'earring';
      }

      // Detect materials
      if (lowercaseMsg.includes('gold')) {
        filters.material = 'gold';
      } else if (lowercaseMsg.includes('silver')) {
        filters.material = 'silver';
      } else if (lowercaseMsg.includes('diamond')) {
        filters.material = 'diamond';
      }

      // Detect price range
      if (lowercaseMsg.includes('cheap') || lowercaseMsg.includes('affordable')) {
        filters.priceRange = [0, 500];
      } else if (lowercaseMsg.includes('expensive') || lowercaseMsg.includes('luxury')) {
        filters.priceRange = [1000, 10000];
      }

      // Detect style
      if (lowercaseMsg.includes('modern')) {
        filters.style = 'modern';
      } else if (lowercaseMsg.includes('classic') || lowercaseMsg.includes('traditional')) {
        filters.style = 'classic';
      } else if (lowercaseMsg.includes('elegant')) {
        filters.style = 'elegant';
      }

      // Greeting
      if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi') || lowercaseMsg.includes('hey')) {
        botResponse = "Hello there! 👋 I'm your personal jewelry advisor. Are you looking for something special today? Maybe a stunning necklace, elegant ring, or stylish bracelet?";
      }
      // Budget inquiries
      else if (lowercaseMsg.includes('budget') || lowercaseMsg.includes('price')) {
        botResponse = "I'd be happy to help you find something within your budget! 💰 Could you tell me what price range you're comfortable with, and what type of jewelry you're interested in?";
      }
      // Gift inquiries
      else if (lowercaseMsg.includes('gift') || lowercaseMsg.includes('present')) {
        botResponse = "Finding the perfect gift is so special! ✨ Is this for a birthday, anniversary, or another occasion? And do you have a particular type of jewelry in mind?";
      }
      // More options
      else if (lowercaseMsg.includes('more') || lowercaseMsg.includes('another') || lowercaseMsg.includes('else')) {
        botResponse = "I'd be happy to show you more options! 🌟 Here are some additional pieces you might love:";
        products = await searchProducts(userMessage, filters);
      }
      // Help or recommendations
      else if (lowercaseMsg.includes('help') || lowercaseMsg.includes('recommend')) {
        botResponse = "I'm here to help you find the perfect piece! 💎 Based on current trends, I can recommend some beautiful options. What type of jewelry are you interested in?";
      }
      // Default product search
      else {
        botResponse = "I found some beautiful pieces that might interest you! ✨ Take a look at these:";
        products = await searchProducts(userMessage, filters);
        
        // If no products found
        if (products.length === 0) {
          botResponse = "I couldn't find anything matching exactly what you described. 🔍 Could you tell me more about what you're looking for? Are you interested in rings, necklaces, or bracelets?";
        }
      }
      
      // If we have no products yet but should have them for a non-greeting message
      if (products.length === 0 && 
          !lowercaseMsg.includes('hello') && 
          !lowercaseMsg.includes('hi') && 
          !lowercaseMsg.includes('hey') &&
          !lowercaseMsg.includes('help') &&
          !botResponse.includes("I couldn't find")) {
        products = await searchProducts(userMessage, filters);
      }
      
      // Add follow-up question if we have products
      if (products.length > 0) {
        botResponse += " Would you like me to help you narrow down your options further?";
      } else {
        // Add follow-up if we don't have products and didn't already add one
        if (!botResponse.includes("?")) {
          botResponse += " Is there a specific type of jewelry or style you're looking for?";
        }
      }
      
      // Add bot message with delay for realistic typing effect
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: botResponse, products }]);
        setIsTyping(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Error handling
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: "I apologize, but I'm having trouble finding what you're looking for right now. Could you try rephrasing your request or exploring our collection directly?", 
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
    processMessage(input);
  };

  // If embedded in another UI component
  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : ''}`}>
              <div 
                className={`inline-block p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
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
                        <div className="text-purple-600 font-medium">{formatPrice(product.price)}</div>
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
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
            <button 
              type="submit"
              className="bg-purple-600 text-white px-3 py-2 rounded-r-lg hover:bg-purple-700 focus:outline-none"
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
        className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300"
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
          <div className="bg-purple-600 text-white p-4 flex items-center">
            <FaRegGem size={20} className="mr-2" />
            <h3 className="font-semibold">Jewelry Consultant</h3>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div 
                  className={`inline-block p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
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
                          <div className="text-purple-600 font-medium">{formatPrice(product.price)}</div>
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
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
              <button 
                type="submit"
                className="bg-purple-600 text-white px-3 py-2 rounded-r-lg hover:bg-purple-700 focus:outline-none"
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

export default Chatbot; 