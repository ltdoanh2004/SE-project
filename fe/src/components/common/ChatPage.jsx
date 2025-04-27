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

const ChatPage = () => {
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
			// This is where you'll integrate your AI service in the future
			// For now, we'll simulate a response
			await new Promise((resolve) => setTimeout(resolve, 1000))

			const aiResponse = {
				id: Date.now() + 1,
				text: `This is a simulated AI response to: "${input}"`,
				sender: 'ai',
				timestamp: new Date().toISOString(),
			}

			setMessages((prevMessages) => [...prevMessages, aiResponse])
		} catch (error) {
			console.error('Error getting AI response:', error)
			setMessages((prevMessages) => [
				...prevMessages,
				{
					id: Date.now() + 1,
					text: 'Sorry, I encountered an error processing your request.',
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

	return (
		<div className="absolute h-144 shadow-md flex flex-col">
			{/* Chat header */}
			<div className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
				<div className="flex items-center space-x-2">
					<Bot size={24} />
					<h1 className="text-xl font-semibold">AI Assistant</h1>
				</div>
				<div className="flex space-x-2">
					{/* <button
						onClick={clearChat}
						className="p-2 mr-3 hover:bg-primary-dark rounded-full transition-colors"
						title="Clear chat"
					>
						<Trash size={20} />
					</button> */}
					<button
						onClick={() => setIsChatOpen(!isChatOpen)}
						className="p-2 hover:bg-primary-dark rounded-full transition-colors lg:hidden"
						title={isChatOpen ? 'Close chat' : 'Open chat'}
					>
						{isChatOpen ? <X size={20} /> : <PanelRight size={20} />}
					</button>
				</div>
			</div>

			{/* Chat container */}
			<div
				className={`flex-grow overflow-y-auto p-4 bg-gray-50 ${
					isChatOpen ? 'block' : 'hidden lg:block'
				}`}
			>
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-gray-500">
						<Bot size={48} className="mb-4" />
						<p className="text-lg">How can I help you today?</p>
						<p className="text-sm mt-2">
							Type a message to start a conversation
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
									<span>Thinking...</span>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Input area */}
			<div
				className={`bg-white border-t border-gray-200 p-4 ${
					isChatOpen ? 'block' : 'hidden lg:block'
				}`}
			>
				<form onSubmit={handleSendMessage} className="flex space-x-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your message..."
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
				<p className="text-xs text-gray-500 mt-2 text-center">
					AI responses are simulated. Integration with actual AI services coming
					soon.
				</p>
			</div>

			{/* Mobile chat toggle button (fixed at bottom right when chat is closed) */}
			{!isChatOpen && (
				<button
					onClick={() => setIsChatOpen(true)}
					className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg lg:hidden z-50"
				>
					<Bot size={24} />
				</button>
			)}
		</div>
	)
}

export default ChatPage
