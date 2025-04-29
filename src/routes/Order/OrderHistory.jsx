import React from 'react'
import { Link } from 'react-router-dom'

const OrderHistory = () => {
  const orders = [
    {
      orderNumber: '#2315482546',
      orderId: '#1025400025',
      datePlaced: 'Feb 20, 2024',
      dateDelivered: 'Feb 26, 2024',
      status: 'Delivered',
      itemCount: 2,
      total: 220.0,
    },
    {
      orderNumber: '#2315482547',
      orderId: '#1025400026',
      datePlaced: 'Mar 5, 2024',
      dateDelivered: 'Expected: Mar 12, 2024',
      status: 'In Progress',
      itemCount: 1,
      total: 150.0,
    },
    {
      orderNumber: '#2315482548',
      orderId: '#1025400027',
      datePlaced: 'Feb 22, 2024',
      dateDelivered: 'Feb 28, 2024',
      status: 'Delivered',
      itemCount: 2,
      total: 220.0,
    },
    {
      orderNumber: '#2315482549',
      orderId: '#1025400028',
      datePlaced: 'Feb 23, 2024',
      dateDelivered: 'Feb 29, 2024',
      status: 'In Progress',
      itemCount: 1,
      total: 180.0,
    },
    {
      orderNumber: '#2315482550',
      orderId: '#1025400029',
      datePlaced: 'Feb 24, 2024',
      dateDelivered: 'Mar 1, 2024',
      status: 'Delivered',
      itemCount: 3,
      total: 300.0,
    },
  ]

  const getStatusColor = (status) => {
    if (status === 'Delivered') return 'text-green-600'
    if (status === 'In Progress') return 'text-orange-500'
    return 'text-gray-500'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/order-tracking" className="text-sm text-gray-500 hover:underline">
          Back
        </Link>

        <div className="flex justify-between items-center mt-2">
          <h2 className="text-3xl font-bold text-gray-800">View All Orders</h2>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mt-2">
          <Link to="/" className="hover:underline">
            Home
          </Link>{' '}
          /{' '}
          <Link to="/order-tracking" className="hover:underline">
            Order Tracking
          </Link>{' '}
          /{' '}
          <span className="text-yellow-600 font-semibold">View All Orders</span>
        </div>
      </div>

      {/* Danh sách đơn hàng dạng grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm bg-white">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">Placed: {order.datePlaced}</p>
                <p className="text-sm text-gray-500">{order.dateDelivered}</p>
              </div>
              <div className="mt-4 text-right">
                <p className="text-sm">
                  Status: <span className={`font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                </p>
                <p className="text-sm">Items: {order.itemCount}</p>
                <p className="font-bold">${order.total.toFixed(2)}</p>
                <Link to={`/order-tracking`} className="text-yellow-600 hover:underline text-sm">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory
