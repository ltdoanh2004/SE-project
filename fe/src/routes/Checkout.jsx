import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthProvider } from '../components/provider/provider'
import { OrderService } from '../services/order/OrderService'

const Checkout = () => {
	const cartItems = useSelector((state) => state.cart.items)
	console.log(cartItems)

	// State cho contact info
	const [contactName, setContactName] = useState('')
	const [contactNumber, setContactNumber] = useState('')
	const [billingAddress, setBillingAddress] = useState('')
	const [paymentMethod, setPaymentMethod] = useState('momo')

	const subtotal = cartItems.reduce(
		(total, item) => total + item.price * (item.quantity || 1),
		0,
	)
	const taxes = subtotal * 0.1
	const total = subtotal + taxes
	const { isAuth } = useContext(AuthProvider)
	const navigate = useNavigate()

	const handlePayNowClick = async () => {
		await new Promise(async (resolve, reject) => {
			const orderPayload = {
				items: cartItems.map((item) => ({
					productId: item.id,
					quantity: item.quantity,
				})),
				paytype: paymentMethod,
			}
			await OrderService.creatOrder(orderPayload).then(async (res) => {
				const orderID = res.orderID
				if (paymentMethod === 'zalopay') {
					await OrderService.payByZalo(orderID).then((res) => {
						const payUrl = res.order_url
						window.open(payUrl, '_blank')
						resolve()
					})
				}
				if (paymentMethod === 'momo') {
					await OrderService.payByMomo(orderID).then((res) => {
						const payUrl = res.paymentUrl
						window.open(payUrl, '_blank')
						resolve()
					})
				}
			})
		})
	}
	if (!isAuth) {
		return (
			<div className="min-w-screen min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
							Sign in required
						</h2>
						<p className="mt-2 text-center text-sm text-gray-600">
							Please sign in to complete your checkout
						</p>
					</div>

					<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-yellow-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-yellow-700">
									You need to be signed in to complete your purchase.
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col space-y-4">
						<button
							onClick={() => navigate('/login')}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
						>
							Sign in
						</button>

						<button
							onClick={() => navigate('/register')}
							className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
						>
							Create an account
						</button>

						<Link
							to="/cart"
							className="inline-flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-500 mt-4"
						>
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Return to cart
						</Link>
					</div>
				</div>
			</div>
		)
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
					<h1 className="text-3xl md:text-5xl font-bold text-gray-600">
						Checkout
					</h1>
				</div>
				<div className="mb-5 text-gray-400">
					<Link to="/" className="hover:underline text-gray-500">
						Home
					</Link>{' '}
					/
					<Link to="/cart" className="hover:underline text-gray-500 ml-1">
						Cart
					</Link>{' '}
					/<span className="text-gray-600 ml-1">Checkout</span>
				</div>
			</div>

			{/* Main */}
			<div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
				<div className="w-full -mx-3 md:flex items-start">
					{/* Left: Cart Items */}
					<div className="px-3 md:w-7/12 lg:pr-10">
						{/* Cart Items */}
						{cartItems.map((item) => (
							<div
								key={item.id}
								className="flex items-center mb-6 pb-6 border-b border-gray-200"
							>
								<div className="w-16 h-16 bg-gray-50 border border-gray-200 overflow-hidden rounded-lg">
									<img
										src={`http://localhost:8000${item.image[0]}`}
										alt={item.name}
										className="object-cover w-full h-full"
									/>
								</div>
								<div className="flex-grow pl-3">
									<h6 className="font-semibold uppercase text-gray-600">
										{item.name}
									</h6>
									<p className="text-gray-400">x {item.quantity}</p>
								</div>
								<div>
									<span className="font-semibold text-gray-600 text-xl">
										{Number(item.price).toLocaleString()} VND
									</span>
								</div>
							</div>
						))}
						{/* Discount Code */}
						<div className="mb-6 pb-6 border-b border-gray-200">
							<div className="flex items-end justify-end -mx-2">
								<div className="flex-grow px-2 lg:max-w-xs">
									<label className="text-gray-600 font-semibold text-sm mb-2 ml-1 block">
										Discount code
									</label>
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
								<span className="font-semibold">
									{subtotal.toLocaleString()} VND
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Taxes (10%)</span>
								<span className="font-semibold">
									{taxes.toLocaleString()} VND
								</span>
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
								<label className="font-semibold text-gray-600 block mb-1">
									Contact Name
								</label>
								<input
									type="text"
									value={contactName}
									onChange={(e) => setContactName(e.target.value)}
									placeholder="Enter your name"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
								/>
							</div>

							<div className="mb-3">
								<label className="font-semibold text-gray-600 block mb-1">
									Contact Number
								</label>
								<input
									type="text"
									value={contactNumber}
									onChange={(e) => setContactNumber(e.target.value)}
									placeholder="Enter your phone number"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
								/>
							</div>

							<div>
								<label className="font-semibold text-gray-600 block mb-1">
									Billing Address
								</label>
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
						<div className="border border-gray-200 rounded-lg bg-white p-5 mb-6">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Payment Method
							</h3>

							{/* Momo */}
							<div className="border-b border-gray-200 pb-4 mb-4">
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										name="payment"
										value="momo"
										checked={paymentMethod === 'momo'}
										onChange={() => setPaymentMethod('momo')}
										className="form-radio h-5 w-5 text-pink-500"
									/>
									<div className="ml-3 flex items-center">
										<img
											src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
											className="h-8 mr-2"
											alt="Momo"
										/>
										<span className="font-medium text-gray-700">Momo</span>
									</div>
								</label>
								{paymentMethod === 'momo' && (
									<div className="mt-3 ml-8 text-sm text-gray-600">
										<p>Link your Momo wallet to pay quickly and securely</p>
									</div>
								)}
							</div>

							{/* ZaloPay */}
							<div>
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										name="payment"
										value="zalopay"
										checked={paymentMethod === 'zalopay'}
										onChange={() => setPaymentMethod('zalopay')}
										className="form-radio h-5 w-5 text-blue-500"
									/>
									<div className="ml-3 flex items-center">
										<img
											src="https://img.icons8.com/color/48/000000/zalo.png"
											className="h-8 w-8 mr-2 object-contain"
											alt="ZaloPay"
										/>
										<span className="font-medium text-gray-700">ZaloPay</span>
									</div>
								</label>
								{paymentMethod === 'zalopay' && (
									<div className="mt-3 ml-8 text-sm text-gray-600">
										<p>Pay securely using your ZaloPay account</p>
									</div>
								)}
							</div>
						</div>

						{/* Pay Now Button */}
						<button
							onClick={handlePayNowClick}
							className="w-full bg-indigo-500 hover:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
						>
							<i className="mdi mdi-lock-outline mr-1"></i> PAY NOW
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Checkout
