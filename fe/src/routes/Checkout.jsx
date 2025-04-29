import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Checkout = () => {
	const cartItems = useSelector((state) => state.cart.items)

	// State cho contact info
	const [contactName, setContactName] = useState('')
	const [contactNumber, setContactNumber] = useState('')
	const [billingAddress, setBillingAddress] = useState('')

	const subtotal = cartItems.reduce(
		(total, item) => total + item.price * (item.quantity || 1),
		0,
	)
	const taxes = subtotal * 0.1
	const total = subtotal + taxes

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
										{item.price.toLocaleString()} VND
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
						<div className="border border-gray-200 rounded-lg bg-white p-3 mb-6">
							{/* Visa */}
							<div className="border-b border-gray-200 pb-3 mb-3">
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										name="payment"
										defaultChecked
										className="form-radio h-5 w-5 text-indigo-500"
									/>
									<img
										src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
										className="h-6 ml-3"
										alt="Card Logos"
									/>
								</label>
							</div>

							{/* PayPal */}
							<div>
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										name="payment"
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

						{/* Pay Now Button */}
						<button className="w-full bg-indigo-500 hover:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
							<i className="mdi mdi-lock-outline mr-1"></i> PAY NOW
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Checkout