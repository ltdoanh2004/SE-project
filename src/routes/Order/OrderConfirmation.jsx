import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const OrderConfirmation = () => {
  const navigate = useNavigate()
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleCancelOrder = () => {
    setShowCancelModal(true)
  }

  const confirmCancelOrder = () => {
    setShowCancelModal(false)
    alert('Your order has been canceled!')
    navigate('/')
  }

  const closeCancelModal = () => {
    setShowCancelModal(false)
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-6 relative">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="text-green-500 text-4xl mr-4">✅</div>
        <div>
          <h1 className="text-3xl font-bold">We received your order!</h1>
          <p className="text-gray-600">
            Your order <span className="font-semibold">#2939993</span> is completed and ready to ship
          </p>
        </div>
      </div>
      <hr className="border-gray-300 mb-8" />

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>

          {/* Product list */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 border-b pb-4">
              <img src="/apple-watch.png" alt="Product" className="w-20 h-20 object-cover rounded" />
              <div>
                <p className="font-semibold">Apple Watch Series 7</p>
                <p className="text-gray-500 text-sm">Golden</p>
                <p className="mt-2">$359</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 border-b pb-4">
              <img src="/headphones.png" alt="Product" className="w-20 h-20 object-cover rounded" />
              <div>
                <p className="font-semibold">Beylob 90 Speaker</p>
                <p className="text-gray-500 text-sm">Space Gray</p>
                <p className="mt-2">$49</p>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="mt-8 space-y-2 text-right">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>$589</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>$10</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>$599</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping + Payment Info */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600 text-sm">Wilson Baker</p>
            <p className="text-gray-600 text-sm">4517 Washington Ave, Manchester, Kentucky 39495, USA</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Billing Address</h3>
            <p className="text-gray-600 text-sm">Wilson Baker</p>
            <p className="text-gray-600 text-sm">4517 Washington Ave, Manchester, Kentucky 39495, USA</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Info</h3>
            <p className="text-gray-600 text-sm">Credit Card</p>
            <p className="text-gray-600 text-sm">VISA **** 4660</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/order-history"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg text-center"
        >
          View Order
        </Link>
        <button
          onClick={handleCancelOrder}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg text-center"
        >
          Cancel Order
        </button>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-center">Cancel Order</h2>
            <p className="text-gray-600 mb-6 text-center">Are you sure you want to cancel this order?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmCancelOrder}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Yes, Cancel
              </button>
              <button
                onClick={closeCancelModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderConfirmation
