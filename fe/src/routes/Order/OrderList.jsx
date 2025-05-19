import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { OrderService } from '../../services/order/OrderService'
import { Spin, Badge } from 'antd'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
        try {
            await OrderService.getOrderList().then((response) => {
                console.log('Order data:', response.orders)
                setOrders(response.orders)
                setLoading(false)
            })
        } catch (error) {
            console.error('Error fetching orders:', error)
        }
    })()
  }, [])


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'green'
      case 'unpaid':
        return 'orange'
      case 'cancelled':
        return 'red'
      case 'done': // New case for "done"
        return 'blue'
      default:
        return 'gray'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
		<div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
			<div className="mb-6">
				<Link to="/" className="text-gray-500 hover:text-gray-700">
					Quay lại trang chủ
				</Link>
			</div>
			<h1 className="text-3xl font-bold mb-4 text-gray-800">Toàn bộ đơn hàng</h1>

			<div className="text-sm breadcrumbs mb-6 text-gray-500">
				<span>Trang chủ</span> / <span>Theo dõi đơn hàng</span> /{' '}
				<span className="text-gray-700">Toàn bộ đơn hàng</span>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Spin size="large" />
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{orders.length > 0 ? (
						orders.map((order) => (
							<div
								key={order.id}
								className="border rounded-md p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
							>
								<div className="mb-4">
									<h2 className="font-semibold text-gray-800">
										#{order.orderID}
									</h2>
									<div className="text-sm text-gray-500 flex justify-between items-center mb-2">
										<div>
											<div>Ngày mua: {formatDate(order.date)}</div>
											{order.expectedDelivery && (
												<div>
													Expected: {formatDate(order.expectedDelivery) || ''}
												</div>
											)}
										</div>
										<div className="flex justify-center items-center mb-2">
											<Badge
												color={getStatusColor(
													order.paymentMethod === 'done' // Check for "done" payment method first
														? 'done'
														: order.isPaid && !order.cancel
														? 'paid'
														: order.cancel
														? 'cancelled'
														: 'unpaid',
												)}
												count={
													order.paymentMethod === 'done' // Check for "done" payment method first
														? 'done'
														: order.isPaid && !order.cancel
														? 'paid'
														: order.cancel
														? 'cancelled'
														: 'unpaid'
												}
												className="px-2 mt-2"
											/>
										</div>
									</div>
								</div>

								<div className="flex justify-start items-center mb-4">
                                    <div className="text-sm text-gray-600 mr-2">Giá:</div>
									<div className="font-semibold text-gray-800">
										{(order.money || 0).toLocaleString()} VND
									</div>
								</div>

								<div className="text-center">
									<Link
										to={`/orders/${order.orderID}`}
										className="text-blue-600 hover:text-blue-800 text-sm font-medium"
									>
										Xem chi tiết	
									</Link>
								</div>
							</div>
						))
					) : (
						<div className="col-span-full text-center py-12 text-gray-500">
							Bạn chưa có đơn hàng nào.
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default OrderList