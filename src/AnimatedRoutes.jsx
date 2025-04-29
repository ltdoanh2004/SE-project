import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Import pages
import Home from './routes/Home/Home'
import Login from './routes/Login/Login'
import Register from './routes/Login/Register'
import AboutUs from './routes/Shop/AboutUs'
import Shop from './routes/Shop/Shop'
import OrderTracking from './routes/Order/OrderTracking'
import OrderHistory from './routes/Order/OrderHistory'
import OrderConfirmation from './routes/Order/OrderConfirmation' 

// Import 3D pages
import Jewelry from './routes/Jewelry'

// Import error page
import NotFound from './routes/NotFound'

// Import các trang sản phẩm
import ProductPage from './routes/Product/ProductPage'
import ProductList from './routes/ListProduct/ProductList'

// Import admin pages
import OrderDashboard from './routes/admin/OrderDasboard'
import EmployeeDashboard from './routes/admin/EmployeeDasboard'

// Import cart/checkout
import Cart from './routes/cart/Cart'
import Checkout from './routes/Checkout'

export default function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main pages */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/jewelry">
          <Route index element={<PageWrapper><Jewelry /></PageWrapper>} />
          <Route path=":sex/:filter/:query" element={<PageWrapper><ProductList /></PageWrapper>} />
        </Route>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/order-confirmation" element={<PageWrapper><OrderConfirmation /></PageWrapper>} />
        <Route path="/aboutus" element={<PageWrapper><AboutUs /></PageWrapper>} />
        <Route path="/order-tracking" element={<PageWrapper><OrderTracking /></PageWrapper>} />
        <Route path="/order-history" element={<PageWrapper><OrderHistory /></PageWrapper>} />
        
        {/* Product page */}
        <Route path="/product">
          <Route path=":productId" element={<PageWrapper><ProductPage /></PageWrapper>} />
        </Route>

        {/* Admin dashboard */}
        <Route path="/admin">
          <Route path="order" element={<PageWrapper><OrderDashboard /></PageWrapper>} />
          <Route path="employee" element={<PageWrapper><EmployeeDashboard /></PageWrapper>} />
        </Route>

        {/* 404 Not found */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

// Wrapper để thêm animation cho từng page
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
