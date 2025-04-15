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

import FilterSidebar from './routes/Home/ProductList'
import ProductPage from './routes/Product/ProductPage'
import ConfirmOrderPage from './routes/Order/OrderConfirm'

// Import transitions

export default function AnimatedRoutes() {
	return (
		<Routes>
			{/* All main pages */}
			<Route path="/" element={<Home />} />
			<Route path="/jewelry" element={<Jewelry />} />
			<Route path="/account" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/cart" element={<Shop />} />
			<Route path="/jewelry/:product_type" element={<FilterSidebar/>} />
			<Route path='/product/:id' element={<ProductPage/>}/>
			<Route path='/confirm' element={<ConfirmOrderPage/>}/>


			{/* <Route path="/about" element={<About />} /> */}
			{/* <Route path="/contact" element={<Contact />} /> */}

			{/* Error pages */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	)
}
