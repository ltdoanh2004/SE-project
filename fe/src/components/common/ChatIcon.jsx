import React, { useState } from 'react'
import { MessageSquareText, X } from 'lucide-react'
import ChatPage from './ChatPage'

const ChatIcon = () => {
	const [isChatOpen, setIsChatOpen] = useState(false)

	const toggleChat = () => {
		setIsChatOpen(!isChatOpen)
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

						{/* Chat Component */}
						<div className="h-full">
							<ChatPage minimized={true} onClose={toggleChat} />
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default ChatIcon
