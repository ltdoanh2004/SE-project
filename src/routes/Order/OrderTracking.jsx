import React from 'react'
import { Link } from 'react-router-dom'

const OrderTracking = () => {
  const orderInfo = {
    orderNumber: '#2315482546',
    orderPlaced: 'Feb 20, 2024',
    orderDelivered: 'Feb 26, 2024',
    itemCount: 2,
    status: 'Delivered',
    orderId: '#1025400025',
  }

  const timelineSteps = [
    { step: 1, title: 'Order Placed', date: 'Feb 20, 2024', completed: true },
    { step: 2, title: 'Order Packed', date: 'Feb 20, 2024', completed: true },
    { step: 3, title: 'In Transit', date: 'Feb 22, 2024', completed: true },
    { step: 4, title: 'Out for Delivery', date: 'Feb 26, 2024', completed: false },
  ]

  const products = [
    {
      id: '4553458120',
      name: 'Top for Women',
      size: 'L',
      quantity: 2,
      price: 50,
      img: 'h',
    },
    {
      id: '8953458747',
      name: 'Blue T-shirt for Men',
      size: 'M',
      quantity: 2,
      price: 50,
      img: '',
    },
  ]

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const delivery = 20
  const total = subtotal + delivery

  return (
    <>
      {/* Header giống Checkout */}
      <div className="min-w-screen bg-gray-50 py-5">
        <div className="px-5">
          {/* Back Button */}
          <div className="mb-2">
            <Link
              to="/cart"
              className="flex items-center text-gray-500 text-sm hover:underline"
            >
              <i className="mdi mdi-arrow-left text-gray-400 mr-1"></i> Back
            </Link>
          </div>

          {/* Title */}
          <div className="mb-2">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-600">Order Tracking</h1>
          </div>

          <Link to="/order-history" className="text-yellow-600 hover:underline text-sm font-medium ml-auto">
            View All Orders
          </Link>


          {/* Breadcrumbs */}
          <div className="mb-5 text-gray-400">
            <Link to="/" className="hover:underline text-gray-500">Home</Link>
            <span className="mx-1">/</span>
            <Link to="/cart" className="hover:underline text-gray-500">Cart</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-600">Order Tracking</span>
          </div>
        </div>
      </div>

      {/* Nội dung Tracking */}
      <section className="py-24 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 mx-auto flex flex-col gap-10">
          
          {/* Order Details */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h3 className="text-2xl font-semibold text-gray-900">Order Details</h3>
              <button className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all">
                Download Invoice
              </button>
            </div>

            <div className="flex flex-wrap gap-10 border-t border-b py-6">
              {[
                { label: 'Order Number', value: orderInfo.orderNumber },
                { label: 'Order Placed', value: orderInfo.orderPlaced },
                { label: 'Order Delivered', value: orderInfo.orderDelivered },
                { label: 'No of Items', value: `${orderInfo.itemCount} items` },
                { label: 'Status', value: orderInfo.status },
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <h6 className="text-gray-500">{item.label}</h6>
                  <h4 className="text-black text-xl font-semibold">{item.value}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <h3 className="text-2xl font-semibold text-gray-900">Order Tracking</h3>
              <h3 className="text-2xl font-semibold text-gray-600">Order ID: {orderInfo.orderId}</h3>
            </div>

            <div className="w-full border rounded-xl p-9">
              <ol className="flex flex-col sm:flex-row w-full gap-8 sm:gap-0 items-center">
                {timelineSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className={`flex flex-col items-center w-full relative ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2"
                      style={{
                        backgroundColor: step.completed ? '#F59E0B' : 'transparent', //tracking bar timeline
                        borderColor: '#F59E0B',
                        color: step.completed ? '#ffffff' : '#F59E0B',
                      }}>
                      {step.step}
                    </div>
                    <p className="mt-2 text-center text-sm">{step.title}</p>
                    <span className="text-xs text-center">{step.date}</span>
                    {idx !== timelineSteps.length - 1 && (
                      <div className="absolute hidden sm:block top-4 left-1/2 w-full h-0.5 bg-gray-300"></div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-col gap-10">
            <h3 className="text-2xl font-semibold text-gray-900">Items from the order</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product, idx) => (
                <div key={idx} className="flex gap-4 items-center border-b py-4">
                  <img src={product.img} alt={product.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50" />
                  <div className="flex flex-col gap-1 flex-grow">
                    <h4 className="text-lg font-semibold">{product.name}</h4>
                    <p className="text-gray-500 text-sm">Product ID: {product.id}</p>
                    <div className="flex justify-between mt-2 text-gray-700 text-base">
                      <span>Quantity: {product.quantity}</span>
                      <span>${(product.price * product.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
            <div className="border p-6 rounded-xl flex flex-col gap-4">
              <div className="flex justify-between">
                <h4 className="text-xl text-gray-600">Discount</h4>
                <h4 className="text-xl font-semibold text-black">$0.00</h4>
              </div>
              <div className="flex justify-between">
                <h4 className="text-xl text-gray-600">Delivery</h4>
                <h4 className="text-xl font-semibold text-black">${delivery.toFixed(2)}</h4>
              </div>
            </div>
            <div className="border p-6 rounded-xl flex flex-col gap-4">
              <div className="flex justify-between">
                <h4 className="text-xl text-gray-600">Subtotal</h4>
                <h4 className="text-xl font-semibold text-black">${subtotal.toFixed(2)}</h4>
              </div>
              <div className="flex justify-between">
                <h4 className="text-xl text-gray-600">Total</h4>
                <h4 className="text-xl font-semibold text-black">${total.toFixed(2)}</h4>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default OrderTracking
