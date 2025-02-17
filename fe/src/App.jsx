import Header from './components/Header'
import Footer from './components/Footer'
import AnimatedRoutes from './AnimatedRoutes'
// import Navbar from './components/Navbar/Navbar'

export default function App() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			{/* <Navbar /> */}
			<AnimatedRoutes />
			<Footer />
		</div>
	)
}
