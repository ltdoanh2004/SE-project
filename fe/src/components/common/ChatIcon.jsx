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
					className="fixed bottom-8 right-8 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 flex items-center justify-center"
					aria-label="Open chat"
				>
					<MessageSquareText size={24} />
				</button>
			)}

			{/* Chat Dialog Container */}
			{isChatOpen && (
				<div className="fixed bottom-0 right-0 z-50 w-full sm:w-96 h-144 max-h-144 shadow-xl transition-all duration-300 ease-in-out">
					<div className="relative h-full flex flex-col bg-white rounded-t-lg overflow-hidden border border-gray-200">
						{/* Close Button */}
						<button
							onClick={toggleChat}
							className="absolute top-3 right-3 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
							aria-label="Close chat"
						>
							<X size={18} />
						</button>

						{/* Chat Type Selector */}
						<div className="absolute top-3 left-3 z-10 flex gap-2">
							<button
								onClick={() => switchChatType('support')}
								className={`p-1.5 rounded-full transition-colors flex items-center ${
									chatType === 'support' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
								}`}
								aria-label="Customer Support"
								title="Customer Support"
							>
								<UserRound size={16} />
							</button>
							<button
								onClick={() => switchChatType('ai')}
								className={`p-1.5 rounded-full transition-colors flex items-center ${
									chatType === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
								}`}
								aria-label="Jewelry AI Assistant"
								title="Jewelry AI Assistant"
							>
								<Bot size={16} />
							</button>
							<button
								onClick={() => switchChatType('openai')}
								className={`p-1.5 rounded-full transition-colors flex items-center ${
									chatType === 'openai' ? 'bg-yellow-500 text-black' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
								<div className="pt-12 h-full">
									<div className="bg-purple-600 text-white p-4 flex items-center">
										<Bot size={20} className="mr-2" />
										<h3 className="font-semibold">Jewelry AI Assistant</h3>
									</div>
									<Chatbot embedded={true} />
								</div>
							) : (
								<div className="pt-12 h-full">
									<div className="bg-yellow-500 text-black p-4 flex items-center">
										<Sparkles size={20} className="mr-2" />
										<h3 className="font-semibold">Jeify Jewelry Consultant</h3>
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
