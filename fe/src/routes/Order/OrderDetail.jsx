import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { OrderService } from '../../services/order/OrderService'
import { Steps, Button, Tag, Spin } from 'antd'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const OrderDetail = () => {
	const { orderId } = useParams()
	const [order, setOrder] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchOrderDetails()
	}, [orderId])

	const fetchOrderDetails = async () => {
		try {
			setLoading(true)
			const response = await OrderService.getOrderById(orderId)
			setOrder(response.order)
		} catch (error) {
			console.error('Failed to fetch order details:', error)
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString) => {
		if (!dateString) return ''
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	const getCurrentStepIndex = () => {
		if (order?.paymentMethod === 'processing' || !order?.isPaid) return 0
		if (order?.products.some((p) => !p.shipped)) return 1
		if (order?.products.every((p) => p.shipped) && !order.paymentMethod) return 2
		return 3
	}

	const getStatusDisplay = () => {
		if (order?.cancel) return 'Cancelled'
		if (order?.paymentMethod === 'done') return 'Completed' // Handle "done" payment method
		if (!order?.isPaid) return 'Awaiting Payment'
		if (order?.products.some((p) => !p.shipped)) return 'Processing'
		if (order?.products.every((p) => p.shipped) && !order.paymentMethod)
			return 'In Transit'
		return 'Delivered'
	}

	const generateInvoice = () => {
		const doc = new jsPDF()

		// Add header
		doc.setFontSize(20)
		doc.text('Invoice', 105, 20, { align: 'center' })
		doc.setFontSize(12)
		doc.text(`Order #${order.orderID}`, 105, 30, { align: 'center' })
		doc.text(`Date: ${formatDate(order.date)}`, 105, 40, { align: 'center' })

		// Create table for items
		const tableColumn = ['Product', 'Price', 'Discount', 'Quantity', 'Total']
		const tableRows = order.products.map((product) => [
			product.name,
			`${Number(product.price).toLocaleString()} VND`,
			`${product.discount}%`,
			product.quantity,
			`${product.total.toLocaleString()} VND`,
		])

		// Add items table
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 50,
			theme: 'grid',
			headStyles: { fillColor: [200, 162, 38] },
		})

		// Add summary
		const finalY = doc.previousAutoTable.finalY + 10

		doc.text('Subtotal:', 140, finalY)
		doc.text(
			`${order.products
				.reduce((sum, item) => sum + item.total, 0)
				.toLocaleString()} VND`,
			195,
			finalY,
			{ align: 'right' },
		)

		doc.text('Delivery Fee:', 140, finalY + 10)
		doc.text('20,000 VND', 195, finalY + 10, { align: 'right' })

		doc.text('Discount:', 140, finalY + 20)
		doc.text('0 VND', 195, finalY + 20, { align: 'right' })

		doc.setFontSize(14)
		doc.text('Total:', 140, finalY + 30)
		doc.text(`${Number(order.money).toLocaleString()} VND`, 195, finalY + 30, {
			align: 'right',
		})

		// Save the PDF
		doc.save(`Invoice-Order-${order.orderID}.pdf`)
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spin size="large" />
			</div>
		)
	}

	if (!order) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<p className="text-lg text-gray-600">Không tìm thấy order</p>
				<Link
					to="/orders"
					className="text-blue-600 hover:underline mt-4 inline-block"
				>
					Xem tất cả đơn hàng
				</Link>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-6">
				<Link to="/orders" className="text-gray-500 hover:text-gray-700">
					&larr; Trở về danh sách đơn hàng
				</Link>
			</div>

			<h1 className="text-3xl font-bold mb-4 text-gray-800">Theo dõi đơn hàng</h1>

			<div className="flex justify-between items-center mb-6">
				<Link to="/orders" className="text-amber-600 hover:underline">
					Xem tất cả đơn hàng
				</Link>
				<div className="text-sm breadcrumbs text-gray-500">
					<span>Trang chủ</span> / <span>Giỏ hàng</span> /{' '}
					<span className="text-gray-700">Theo dõi đơn hàng</span>
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-md mb-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-800">Chi tiết đơn hàng</h2>
					<Button
						type="primary"
						onClick={generateInvoice}
						className="bg-amber-500 hover:bg-amber-600 border-none"
					>
						Tải hóa đơn
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<div>
						<p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
						<p className="font-semibold text-gray-900">#{order.orderID}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">Ngày mua</p>
						<p className="font-semibold text-gray-900">
							{formatDate(order.date)}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">Số lượng</p>
						<p className="font-semibold text-gray-900">
							{order.products.length} sản phẩm
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">Trạng thái</p>
						<Tag
							color={order.cancel ? 'red' : order.isPaid ? 'green' : 'orange'}
						>
							{getStatusDisplay()}
						</Tag>
					</div>
				</div>

				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800">
						Theo dõi đơn hàng
					</h3>
					<p className="text-sm text-gray-500">Mã đơn hàng: #{order.orderID}</p>
				</div>

				<Steps
					current={getCurrentStepIndex()}
					labelPlacement="vertical"
					className="mb-10"
					items={[
						{
							title: 'Ngày mua',
							description: formatDate(order.date),
						},
						{
							title: 'Đóng gói',
							description: order?.products.some((p) => !p.shipped)
								? 'Processing'
								: formatDate(order.date),
						},
						{
							title: 'Đang giao hàng',
							description: order?.products.every((p) => p.shipped) && order.paymentMethod !== 'done'
								? formatDate(order.date)
								: '',
						},
						{
							title: 'Đã giao hàng',
							description: order?.paymentMethod === 'done'
								? formatDate(order.deliveryDate)
								: '',
						},
					]}
				/>

				<h3 className="text-lg font-semibold text-gray-800 mb-6">
					Thông tin sản phẩm
				</h3>

				<div className="space-y-6 mb-8">
					{order.products.map((product) => (
						<div
							key={product.productID}
							className="flex flex-col md:flex-row justify-between border-b pb-6"
						>
							<div className="flex items-center">
								<div className="w-16 h-16 mr-4">
									<img
										src={`http://localhost:8000${product.images[0]}`}
										alt={product.name}
										className="w-full h-full object-cover rounded"
									/>
								</div>
								<div>
									<h4 className="font-medium text-gray-800">{product.name}</h4>
									<p className="text-sm text-gray-500">
										Mã sản phẩm: {product.productID}
									</p>
									<p className="text-sm text-gray-500">
										Số lượng: {product.quantity}
									</p>
								</div>
							</div>
							<div className="text-right mt-4 md:mt-0">
								<p className="font-medium text-gray-900">
									{Number(product.total).toLocaleString()} VND
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-end">
					<div className="w-full md:w-1/3">
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Tổng phụ</span>
							<span className="font-medium">
								{order.products
									.reduce((sum, item) => sum + item.total, 0)
									.toLocaleString()}{' '}
								VND
							</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Phí vận chuyển</span>
							<span className="font-medium">Miễn phí</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Giảm giá</span>
							<span className="font-medium">0.00 VND</span>
						</div>
						<div className="flex justify-between py-2 font-semibold">
							<span>Tổng cộng</span>
							<span>{Number(order.money).toLocaleString()} VND</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default OrderDetail
