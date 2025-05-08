import React, { useState, useRef, useEffect } from 'react'
import {
	Send,
	User,
	Bot,
	Loader2,
	Trash,
	ChevronDown,
	PanelRight,
	X,
} from 'lucide-react'
import axios from 'axios'

// Shared API URL configuration
const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://your-backend-url.com';
const API_URL = `${BASE_URL}/api`;
console.log("ChatPage loaded with API URL:", API_URL);

const ChatPage = ({ minimized = false, onClose }) => {
	const [messages, setMessages] = useState([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isChatOpen, setIsChatOpen] = useState(true)
	const messagesEndRef = useRef(null)

	// Scroll to bottom whenever messages change
	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	const handleSendMessage = async (e) => {
		e.preventDefault()

		if (!input.trim()) return

		// Add user message
		const userMessage = {
			id: Date.now(),
			text: input,
			sender: 'user',
			timestamp: new Date().toISOString(),
		}

		setMessages((prevMessages) => [...prevMessages, userMessage])
		setInput('')
		setIsLoading(true)

		try {
			console.log("Sending message to chatbot API:", input);
			
			// Call the backend API
			const response = await axios.post(`${API_URL}/chatbot/product-search`, {
				query: input,
			});

			console.log("Response from chatbot API:", response.data);
			
			// Create a response with products if available
			let aiResponseText = "Tôi đã tìm thấy một số sản phẩm có thể bạn sẽ thích!";
			
			if (!response.data.success || !response.data.products || response.data.products.length === 0) {
				aiResponseText = "Tôi không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn. Bạn có thể thử tìm kiếm khác không?";
			}
			
			const aiResponse = {
				id: Date.now() + 1,
				text: aiResponseText,
				sender: 'ai',
				timestamp: new Date().toISOString(),
				products: response.data.products || []
			}

			setMessages((prevMessages) => [...prevMessages, aiResponse])
		} catch (error) {
			console.error('Error getting AI response:', error);
			
			setMessages((prevMessages) => [
				...prevMessages,
				{
					id: Date.now() + 1,
					text: 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
					sender: 'ai',
					isError: true,
					timestamp: new Date().toISOString(),
				},
			])
		} finally {
			setIsLoading(false)
		}
	}

	const clearChat = () => {
		setMessages([])
	}

	const formatTime = (timestamp) => {
		const date = new Date(timestamp)
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(price);
	};

	return (
		<div className={`${minimized ? '' : 'absolute'} h-full w-full shadow-md flex flex-col`}>
			{/* Chat header */}
			<div className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
				<div className="flex items-center space-x-2">
					<Bot size={24} />
					<h1 className="text-xl font-semibold">Hỗ Trợ Khách Hàng</h1>
				</div>
				<div className="flex space-x-2">
					<button
						onClick={clearChat}
						className="p-2 hover:bg-primary-dark rounded-full transition-colors"
						title="Clear chat"
					>
						<Trash size={20} />
					</button>
					{onClose && (
						<button
							onClick={onClose}
							className="p-2 hover:bg-primary-dark rounded-full transition-colors"
							title="Close chat"
						>
							<X size={20} />
						</button>
					)}
				</div>
			</div>

			{/* Chat container */}
			<div className="flex-grow overflow-y-auto p-4 bg-gray-50">
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-gray-500">
						<Bot size={48} className="mb-4" />
						<p className="text-lg">Tôi có thể giúp gì cho bạn hôm nay?</p>
						<p className="text-sm mt-2">
							Nhập tin nhắn để bắt đầu cuộc hội thoại
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.sender === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`
                    max-w-[80%] p-4 rounded-lg shadow-sm flex space-x-3
                    ${
											message.sender === 'user'
												? 'bg-primary text-white'
												: message.isError
												? 'bg-red-50 text-red-700 border border-red-200'
												: 'bg-white text-gray-800 border border-gray-200'
										}
                  `}
								>
									<div className="flex-shrink-0 mt-1">
										{message.sender === 'user' ? (
											<User size={18} />
										) : (
											<Bot size={18} />
										)}
									</div>
									<div className="flex-1">
										<div className="whitespace-pre-wrap">{message.text}</div>
										
										{/* Product recommendations */}
										{message.products && message.products.length > 0 && (
											<div className="mt-3 space-y-2">
												{message.products.slice(0, 3).map((product, idx) => (
													<a
														key={idx}
														href={product.link}
														className="block p-2 border rounded hover:bg-gray-50 transition"
													>
														<div className="flex">
															{product.image && (
																<div className="w-14 h-14 bg-gray-100 rounded overflow-hidden mr-3">
																	<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
																</div>
															)}
															<div>
																<div className="font-medium text-primary">{product.name}</div>
																<div className="text-sm text-gray-600">{formatPrice(product.price)}</div>
															</div>
														</div>
													</a>
												))}
											</div>
										)}
										
										<div
											className={`text-xs mt-1 ${
												message.sender === 'user'
													? 'text-primary-100'
													: 'text-gray-500'
											}`}
										>
											{formatTime(message.timestamp)}
										</div>
									</div>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-2 text-gray-500">
									<Loader2 size={18} className="animate-spin" />
									<span>Đang suy nghĩ...</span>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Input area */}
			<div className="bg-white border-t border-gray-200 p-4">
				<form onSubmit={handleSendMessage} className="flex space-x-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Nhập tin nhắn của bạn..."
						className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						disabled={isLoading}
					/>
					<button
						type="submit"
						className={`bg-primary text-white p-3 rounded-lg ${
							isLoading || !input.trim()
								? 'opacity-50 cursor-not-allowed'
								: 'hover:bg-primary-dark'
						}`}
						disabled={isLoading || !input.trim()}
					>
						{isLoading ? (
							<Loader2 size={20} className="animate-spin" />
						) : (
							<Send size={20} />
						)}
					</button>
				</form>
			</div>
		</div>
	)
}

export default ChatPage
