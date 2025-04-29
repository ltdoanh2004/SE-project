import React, { useState, useEffect } from 'react'
import { MessageSquareText, X, Bot, UserRound, Sparkles } from 'lucide-react'
import ChatPage from './ChatPage'
import Chatbot from '../Chatbot'
import ChatbotOpenAI from '../Chatbot/ChatbotOpenAI'

const ChatIcon = () => {
	const [isChatOpen, setIsChatOpen] = useState(false)
	const [chatType, setChatType] = useState('openai') // 'support', 'ai', or 'openai'

	// Listen for chat open events from other components
	useEffect(() => {
		const handleChatOpen = (event) => {
			console.log("Chat open event received from:", event.detail.source);
			setIsChatOpen(true);
		};

		// Add event listener
		document.addEventListener('openJeifyChat', handleChatOpen);

		// Cleanup
		return () => {
			document.removeEventListener('openJeifyChat', handleChatOpen);
		};
	}, []);

	const toggleChat = () => {
		console.log("Toggle chat:", !isChatOpen);
		setIsChatOpen(!isChatOpen)
	}

	const switchChatType = (type) => {
		console.log("Switch chat type to:", type);
		setChatType(type)
	}

	return (
		<>
			{/* Floating Chat Button */}
			{!isChatOpen && (
				<button
					onClick={toggleChat}
					className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 group"
					aria-label="Open chat"
				>
					<MessageSquareText size={24} className="transform group-hover:rotate-12 transition-transform" />
					<span className="font-medium pr-1">Chat with Us</span>
				</button>
			)}

			{/* Chat Dialog Container */}
			{isChatOpen && (
				<div className="fixed bottom-8 right-8 z-50 w-full sm:w-96 h-[550px] shadow-2xl transition-all duration-300 ease-in-out animate-slideUp">
					<div className="relative h-full flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-yellow-200">
						{/* Close Button - More visible */}
						<button
							onClick={toggleChat}
							className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
							aria-label="Close chat"
						>
							<X size={20} />
						</button>

						{/* Chat Type Selector */}
						<div className="absolute top-3 left-3 z-10 flex gap-2 bg-white/80 p-1.5 rounded-full shadow-md backdrop-blur-sm">
							<button
								onClick={() => switchChatType('support')}
								className={`p-2 rounded-full transition-all duration-300 flex items-center ${
									chatType === 'support' 
										? 'bg-primary text-white shadow-md scale-110' 
										: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
								}`}
								aria-label="Customer Support"
								title="Customer Support"
							>
								<UserRound size={16} />
							</button>
							<button
								onClick={() => switchChatType('ai')}
								className={`p-2 rounded-full transition-all duration-300 flex items-center ${
									chatType === 'ai' 
										? 'bg-purple-600 text-white shadow-md scale-110' 
										: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
								}`}
								aria-label="Jewelry AI Assistant"
								title="Jewelry AI Assistant"
							>
								<Bot size={16} />
							</button>
							<button
								onClick={() => switchChatType('openai')}
								className={`p-2 rounded-full transition-all duration-300 flex items-center ${
									chatType === 'openai' 
										? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-md scale-110' 
										: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
								}`}
								aria-label="Jeify Jewelry Consultant"
								title="Jeify Jewelry Consultant"
							>
								<Sparkles size={16} />
							</button>
						</div>

						{/* Chat Component */}
						<div className="h-full">
							{chatType === 'support' ? (
								<ChatPage minimized={true} onClose={toggleChat} />
							) : chatType === 'ai' ? (
								<div className="pt-16 h-full">
									<div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-4 flex items-center justify-between shadow-md">
										<div className="flex items-center">
											<Bot size={20} className="mr-2" />
											<h3 className="font-semibold">Jewelry AI Assistant</h3>
										</div>
										<button
											onClick={toggleChat}
											className="p-2 hover:bg-white/20 rounded-full transition-colors"
											aria-label="Close chat"
										>
											<X size={18} />
										</button>
									</div>
									<Chatbot embedded={true} />
								</div>
							) : (
								<div className="pt-16 h-full">
									<div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black p-4 flex items-center justify-between shadow-md">
										<div className="flex items-center">
											<Sparkles size={20} className="mr-2" />
											<h3 className="font-semibold">Jeify Jewelry Consultant</h3>
										</div>
										<button
											onClick={toggleChat}
											className="p-2 hover:bg-black/10 rounded-full transition-colors"
											aria-label="Close chat"
										>
											<X size={18} />
										</button>
									</div>
									<ChatbotOpenAI embedded={true} />
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default ChatIcon
