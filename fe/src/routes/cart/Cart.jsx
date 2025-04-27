import React from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Contact from '../Home/Contact'
import { removeFromCart, updateQuantity } from '../../redux/actions/cartActions'
import { ArrowRight } from 'lucide-react'

const Cart = () => {
	const cartItems = useSelector((state) => state.cart.items)
	const dispatch = useDispatch()

	// Calculate subtotal
	const subtotal = cartItems.reduce(
		(total, item) => total + item.price * (item.quantity || 1),
		0,
	)
	const deliveryFee = 30000
	const discount = 0
	const total = subtotal + deliveryFee - discount

	const handleRemove = (item) => {
		// Dispatch an action to remove the item from the cart
		dispatch(removeFromCart(item.id))
	}

	const handlechangeQuantity = (item, quantity) => {
		// Dispatch an action to remove the item from the cart
		console.log(item.quantity)
		if(item.quantity < 1) {
			dispatch(removeFromCart(item.id))
			}
		dispatch(updateQuantity(item.id, quantity))
	}
	return (
		<>
			<div className="container mx-auto py-12">
				<div className="bg-gray-100 py-10 px-12 rounded-xl">
					<h1 className="text-center font-semibold text-2xl mb-4">
						Giỏ hàng của bạn
					</h1>

					<table className="w-full">
						<thead>
							<tr>
								<th colSpan={2} className="border-b border-gray-500 py-4">
									<div className="flex items-center gap-x-4">
										<input type="checkbox" name="" id="select-all" />

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
											<input type="checkbox" name="" id={`item-${item.id}`} />
										</td>

										<td className="border-b border-gray-500 py-4">
											<div className="flex items-center gap-x-3">
												<img
													src={item.image}
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
														<div className="px-3 cursor-pointer">
															<button
																onClick={(e) => {
																	e.preventDefault()
																	handlechangeQuantity(item, item.quantity + 1)
																}}
															>
																<FaPlus />
															</button>
														</div>

														<input
															type="text"
															value={item.quantity || 1}
															className="bg-transparent outline-none w-12 text-center"
															readOnly
														/>

														<div className="px-3 cursor-pointer">
															<button
																onClick={(e) => {
																	e.preventDefault()
																	handlechangeQuantity(item, item.quantity - 1)
																}}
															>
																<FaMinus />
															</button>
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
											<button
												onClick={() => {
													handleRemove(item)
												}}
											>
												<FaRegTrashAlt className="cursor-pointer" />
											</button>
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
							placeholder="Discount code"
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
						<Link to="/payment">
							<p className="bg-primary hover:bg-secondary font-semibold px-12 text-center py-3 rounded-xl inline-block">
								Thanh toán <ArrowRight className="inline-block mb-[1px] ml-1" />
							</p>
						</Link>
					</div>
				</div>
			</div>

			<Contact />
		</>
	)
}

export default Cart
