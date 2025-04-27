import Header from './components/Header'
import Footer from './components/Footer'
import AnimatedRoutes from './AnimatedRoutes'
import { useEffect, useLayoutEffect, useState } from 'react'
import { AuthProvider } from './components/provider/provider'
import { CookieService } from './utils/CookieService'
import { useNavigate } from 'react-router-dom'
import ChatPage from './components/common/ChatPage'
import ChatIcon from './components/common/ChatIcon'
// import Navbar from './components/Navbar/Navbar'

export default function App() {
	const [isAuth, setIsAuth] = useState(false)
	useLayoutEffect(() => {
		const token = CookieService.getCookie('token')
		if (token) {
			setIsAuth(true)
		} else {
			setIsAuth(false)
		}
	}, [isAuth])

	return (
		<div className="flex flex-col w-full min-h-screen">
			<AuthProvider.Provider value={{ isAuth, setIsAuth }}>
				<Header />
				{/* <Navbar /> */}
				<AnimatedRoutes />
				<Footer />
				<ChatIcon />
			</AuthProvider.Provider>
		</div>
	)
}
