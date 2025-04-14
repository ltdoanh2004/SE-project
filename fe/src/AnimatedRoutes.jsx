import { Routes, Route } from 'react-router-dom'

// Import pages
import Home from './routes/Home/Home'
import Login from './routes/Login/Login'
import Register from './routes/Login/Register'
import Shop from './routes/Shop/Shop'

// Import 3d pages
import Jewelry from './routes/Jewelry'

// Import error pages
import NotFound from './routes/NotFound'

import ProductPage from './routes/Product/ProductPage'
import ProductList from './routes/ListProduct/ProductList'

// Import transitions

export default function AnimatedRoutes() {
	return (
		<Routes>
			{/* All main pages */}
			<Route path="/" element={<Home />} />
			<Route path="/jewelry">
				<Route index element={<Jewelry />} />
				<Route path=":listQuery" element={<ProductList />} />
			</Route>
			<Route path="/account" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/cart" element={<Shop />} />
			<Route path="/product">
				<Route index />
				<Route path=":productId" element={<ProductPage />} />
			</Route>

			{/* <Route path="/about" element={<About />} /> */}
			{/* <Route path="/contact" element={<Contact />} /> */}

			{/* Error pages */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	)
}
