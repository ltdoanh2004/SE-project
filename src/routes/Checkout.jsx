import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Checkout = () => {
  const navigate = useNavigate()
  const cartItems = useSelector((state) => state.cart.items)

  const [contactName, setContactName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isPaying, setIsPaying] = useState(false)
  const [showFailModal, setShowFailModal] = useState(false) // ✅ thêm state modal

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  )
  const taxes = subtotal * 0.1
  const total = subtotal + taxes

  const handlePayNow = async () => {
    try {
      setIsPaying(true)
      console.log('Đang tiến hành thanh toán...')

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const isPaymentSuccess = true // test

      if (isPaymentSuccess) {
        console.log('Thanh toán thành công!')
        navigate('/order-confirmation')
      } else {
        console.error('Thanh toán thất bại.')
        setShowFailModal(true)
      }
    } catch (error) {
      console.error('Đã có lỗi xảy ra:', error)
      setShowFailModal(true)
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 py-5">
      <div className="px-5">
        {/* Header */}
        <div className="mb-2">
          <Link
            to="/cart"
            className="flex items-center text-gray-500 text-sm hover:underline"
          >
            <i className="mdi mdi-arrow-left text-gray-400 mr-1"></i> Back
          </Link>
        </div>
        <div className="mb-2">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-600">Checkout</h1>
        </div>
        <div className="mb-5 text-gray-400">
          <Link to="/" className="hover:underline text-gray-500">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/cart" className="hover:underline text-gray-500">Cart</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Checkout</span>
        </div>
      </div>

      {/* Main */}
      <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
        <div className="w-full -mx-3 md:flex items-start">
          {/* Left: Cart Items */}
          <div className="px-3 md:w-7/12 lg:pr-10">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 overflow-hidden rounded-lg">
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex-grow pl-3">
                  <h6 className="font-semibold uppercase text-gray-600">{item.name}</h6>
                  <p className="text-gray-400">x {item.quantity}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 text-xl">{item.price.toLocaleString()} VND</span>
                </div>
              </div>
            ))}

            {/* Discount Code */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-end justify-end -mx-2">
                <div className="flex-grow px-2 lg:max-w-xs">
                  <label className="text-gray-600 font-semibold text-sm mb-2 ml-1 block">Discount code</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500"
                    placeholder="XXXXXX"
                  />
                </div>
                <div className="px-2">
                  <button className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-md">
                    APPLY
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{subtotal.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes (10%)</span>
                <span className="font-semibold">{taxes.toLocaleString()} VND</span>
              </div>
            </div>
            <div className="text-xl font-bold flex justify-between">
              <span className="text-gray-600">Total</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
          </div>

          {/* Right: Contact + Payment */}
          <div className="px-3 md:w-5/12">
            {/* Contact Info */}
            <div className="mb-6">
              <div className="mb-3">
                <label className="font-semibold text-gray-600 block mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mb-3">
                <label className="font-semibold text-gray-600 block mb-1">Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-600 block mb-1">Billing Address</label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="border border-gray-200 rounded-lg bg-white p-3 mb-6">
              <div className="border-b border-gray-200 pb-3 mb-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="form-radio h-5 w-5 text-indigo-500"
                  />
                  <img
                    src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                    className="h-6 ml-3"
                    alt="Card Logos"
                  />
                </label>
              </div>
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="form-radio h-5 w-5 text-indigo-500"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    width="80"
                    className="ml-3"
                    alt="PayPal"
                  />
                </label>
              </div>
            </div>

            {/* Card Information Form */}
            {paymentMethod === 'card' && (
              <div className="mb-6">
                <div className="mb-3">
                  <label className="font-semibold text-gray-600 block mb-1">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-3">
                  <label className="font-semibold text-gray-600 block mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex -mx-2">
                  <div className="px-2 w-1/2">
                    <label className="font-semibold text-gray-600 block mb-1">Expire</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                  <div className="px-2 w-1/2">
                    <label className="font-semibold text-gray-600 block mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            <button
              onClick={handlePayNow}
              disabled={isPaying}
              className="w-full bg-indigo-500 hover:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
            >
              {isPaying ? 'Processing...' : (
                <>
                  <i className="mdi mdi-lock-outline mr-1"></i> PAY NOW
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal when payment fail */}
      {showFailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-center text-red-600">Payment Failed</h2>
            <p className="text-gray-700 mb-6 text-center">
              Payment failed! Please check your information or try a different payment method.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowFailModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
