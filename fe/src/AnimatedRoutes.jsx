import { Routes, Route } from 'react-router-dom'

// Import pages
import Home from './routes/Home/Home'
import Login from './routes/Login/Login'
import Register from './routes/Login/Register'
import AboutUs from './routes/Shop/AboutUs'
import Shop from './routes/Shop/Shop'

// Import 3d pages
import Jewelry from './routes/Jewelry'

// Import error pages
import NotFound from './routes/NotFound'

import ProductPage from './routes/Product/ProductPage'
import { ProductDetail } from './routes/ProductDetail/ProductDetail';
import ConfirmOrderPage from './routes/Order/OrderConfirm'
import ProductList from './routes/ListProduct/ProductList'
import OrderDashboard from './routes/admin/OrderDasboard'
import EmployeeDashboard from './routes/admin/EmployeeDasboard'
import Cart from './routes/cart/Cart'
import Checkout from './routes/Checkout'
import OrderList from './routes/Order/OrderList'
import OrderDetail from './routes/Order/OrderDetail'
import ChangePassword from './routes/Login/ChangePassword'

// Import transitions

export default function AnimatedRoutes() {
	return (
		<Routes>
			{/* All main pages */}
			<Route path="/" element={<Home />} />
			<Route path="/jewelry">
				<Route index element={<Jewelry />} />
				<Route path=":fit/:category/:value" element={<ProductList />} />
			</Route>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/changePassword" element={<ChangePassword />} />
			<Route path="/cart" element={<Cart />} />
			{/* <Route path="/jewelry/:product_type" element={<FilterSidebar/>} /> */}
			{/* <Route path='/product/:id' element={<ProductPage/>}/> */}
			<Route path="/confirm" element={<ConfirmOrderPage />} />
			<Route path="/aboutus" element={<AboutUs />} />

			<Route path="/product">
				<Route index />
				<Route path=":productId" element={<ProductPage />} />
			</Route>
			<Route path="/admin">
				<Route path="order" element={<OrderDashboard />} />
				<Route path="employee" element={<EmployeeDashboard />} />
			</Route>
			<Route path="/checkout" element={<Checkout />} />
			<Route path="/orders" element={<OrderList />} />
			<Route path="/orders/:orderId" element={<OrderDetail />} />

			{/* <Route path="/about" element={<About />} /> */}
			{/* <Route path="/contact" element={<Contact />} /> */}

			{/* Error pages */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	)
}