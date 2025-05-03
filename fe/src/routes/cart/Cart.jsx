import React, { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Contact from '../Home/Contact'
import { removeFromCart, updateQuantity } from '../../redux/actions/cartActions'
import { ArrowRight } from 'lucide-react'

const Cart = () => {
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
	const [selectedItems, setSelectedItems] = useState({})
	const [selectAll, setSelectAll] = useState(false)

	const cartItems = useSelector((state) => state.cart.items)
	console.log(cartItems)
		const dispatch = useDispatch()
		const navigate = useNavigate()

	// Calculate subtotal
	const subtotal = cartItems.reduce(
		(total, item) => total + item.price * (item.quantity || 1),
		0,
	)
	const deliveryFee = 30000
	const discount = 0
	const total = subtotal + deliveryFee - discount

	// Increase quantity
	const handleIncrease = (id) => {
		const item = cartItems.find((item) => item.id === id)
		if (item) {
			dispatch({
				type: 'UPDATE_QUANTITY',
				payload: { id, quantity: (item.quantity || 1) + 1 },
			})
		}
	}

	// Decrease quantity
	const handleDecrease = (id) => {
		const item = cartItems.find((item) => item.id === id)
		if (item && item.quantity > 1) {
			dispatch({
				type: 'UPDATE_QUANTITY',
				payload: { id, quantity: item.quantity - 1 },
			})
		}
	}

	// Remove product
	const handleRemove = (id) => {
		dispatch({ type: 'REMOVE_FROM_CART', payload: id })
	}

	// Select all products
	const handleSelectAll = (e) => {
		const checked = e.target.checked
		setSelectAll(checked)
		const newSelected = {}
		cartItems.forEach((item) => {
			newSelected[item.id] = checked
		})
		setSelectedItems(newSelected)
	}

	// Select single item
	const handleSelectItem = (id) => {
		setSelectedItems((prev) => ({
			...prev,
			[id]: !prev[id],
		}))
	}

	// Move to Checkout Page
	const handleGoToCheckout = () => {
		navigate('/checkout')
	}

	// Subtotal

	return (
		<>
			<div className="container mx-auto py-12">
				<div className="bg-gray-100 py-10 px-12 rounded-xl">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<Link
							to="/"
							className="text-black-600 font-semibold hover:underline flex items-center gap-2"
						>
							<span className="text-lg">←</span> Trở về
						</Link>
						<h1 className="text-center font-bold text-2xl">
							Giỏ hàng của bạn
						</h1>
						<div className="w-32"></div>
					</div>

					{/* Cart Table */}

					<table className="w-full">
						<thead>
							<tr>
								<th colSpan={2} className="border-b border-gray-500 py-4">
									<div className="flex items-center gap-x-4">
										<input
											type="checkbox"
											id="select-all"
											checked={selectAll}
											onChange={handleSelectAll}
										/>
										<label
											htmlFor="select-all"
											className="font-normal select-none cursor-pointer"
										>
											Chọn tất cả
										</label>
									</div>
								</th>

								<th className="border-b border-gray-500 py-4 text-left">
									<p className="bg-primary font-semibold w-32 px-2 text-center py-2 rounded-xl inline-block">
										Giá
									</p>
								</th>

								<th className="border-b border-gray-500 py-4"></th>
							</tr>
						</thead>
						<tbody>
							{cartItems.length > 0 ? (
								cartItems.map((item) => (
									<tr key={item.id}>
										<td className="border-b border-gray-500 py-4">
											<input
												type="checkbox"
												checked={selectedItems[item.id] || false}
												onChange={() => handleSelectItem(item.id)}
											/>
										</td>

										<td className="border-b border-gray-500 py-4">
											<div className="flex items-center gap-x-3">
												<img
													src={`http://localhost:8000${item.image[0]}`}
													alt={item.name}
													className="w-40 h-40 object-cover rounded-md"
												/>

												<div>
													<p className="text-lg font-medium mb-2">
														{item.name}
													</p>
													<p>Mã sản phẩm: {item.id}</p>

													<form
														action=""
														className="inline-flex items-center border rounded border-black h-10 mt-4"
													>
														<div
															className="px-3 cursor-pointer"
															onClick={() => handleIncrease(item.id)}
														>
															<FaPlus />
														</div>

														<input
															type="text"
															value={item.quantity || 1}
															className="bg-transparent outline-none w-12 text-center"
															readOnly
														/>

														<div
															className="px-3 cursor-pointer"
															onClick={() => handleDecrease(item.id)}
														>
															<FaMinus />
														</div>
													</form>
												</div>
											</div>
										</td>

										<td className="border-b border-gray-500 py-4">
											<p className="font-semibold">
												{(item.price * item.quantity).toLocaleString()} VND
											</p>
										</td>

										<td className="border-b border-gray-500 py-4">
											<FaRegTrashAlt
												className="cursor-pointer text-red-500 hover:text-red-700"
												onClick={() => handleRemove(item.id)}
											/>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className="py-8 text-center">
										Giỏ hàng của bạn đang trống.{' '}
										<Link to="/" className="text-blue-500 underline">
											Tiếp tục mua sắm
										</Link>
									</td>
								</tr>
							)}
						</tbody>
					</table>

					<div className="text-center mt-6 mb-10">
						<input
							type="text"
							placeholder="Mã giảm giá"
							className="w-96 bg-transparent rounded-xl h-12 border border-gray-500 px-3 outline-none"
						/>
					</div>

					<div className="flex items-center py-1 justify-between font-semibold">
						<p>Tổng đơn hàng:</p>
						<p>{subtotal.toLocaleString()} VND</p>
					</div>
					<div className="flex items-center py-1 justify-between font-semibold">
						<p>Giảm giá:</p>
						<p>0.00 %</p>
					</div>
					<div className="flex items-center py-1 justify-between font-semibold">
						<p>Phí vận chuyển:</p>
						<p>{deliveryFee.toLocaleString()} VND</p>
					</div>
					<div className="flex items-center py-1 justify-between font-semibold">
						<p>Tổng cộng:</p>
						<p className="bg-primary font-semibold px-6 text-center py-3 rounded-xl">
							{total.toLocaleString()} VND
						</p>
					</div>

					<div className="text-center mt-4 hover:cursor-pointer">
						<button
							onClick={(e) => {
								e.preventDefault()
								setIsCheckoutOpen(true)
							}}
						>
							<p className="bg-primary hover:bg-secondary font-semibold px-12 text-center py-3 rounded-xl inline-block">
								Thanh toán <ArrowRight className="inline-block mb-[1px] ml-1" />
							</p>
						</button>
					</div>
				</div>
			</div>

			<Contact />

			{/* Modal */}
			{isCheckoutOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-8 rounded-lg w-full max-w-lg relative">
						<button
							onClick={() => setIsCheckoutOpen(false)}
							className="absolute top-4 right-4 text-gray-500 hover:text-black"
						>
							X
						</button>
						<h2 className="text-2xl font-bold mb-4">Tóm tắt đơn hàng</h2>
						<div className="space-y-4">
							<div className="flex justify-between">
								<p>Tạm tính</p>
								<p>{subtotal.toLocaleString()} VND</p>
							</div>
							<div className="flex justify-between">
								<p>Phí vận chuyển</p>
								<p>{deliveryFee.toLocaleString()} VND</p>
							</div>
							<div className="flex justify-between">
								<p>Thuế</p>
								<p>Đã bao gồm</p>
							</div>
							<hr />
							<div className="flex justify-between font-bold text-lg">
								<p>Tổng cộng</p>
								<p>{total.toLocaleString()} VND</p>
							</div>
						</div>
						<button
							className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700"
							onClick={(e) => {
								e.preventDefault()
								handleGoToCheckout()
							}}
						>
							Thực hiện thanh toán	
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default Cart
