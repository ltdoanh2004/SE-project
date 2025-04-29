import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Funnel, Search } from 'lucide-react'

const OrderDashboard = () => {
	const [searchValue, setSearchValue] = useState('')
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

	// Sample order data
	const orders = [
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 2,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 3,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 4,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 5,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 6,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 7,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 8,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 9,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
		{
			id: 10,
			name: 'Đào Hữu Hoài',
			customer: 'Đào Hữu Hoài_ITCSIU22009',
			email: 'daohuuhoai2805@gmail.com',
			date: '22-03-2025',
			quantity: 1,
			status: 'Shipping',
		},
	]

	// Status badge renderer
	const StatusBadge = ({ status }) => {
		const getStatusStyles = () => {
			switch (status.toLowerCase()) {
				case 'shipping':
					return 'bg-blue-100 text-blue-700'
				case 'delivered':
					return 'bg-green-100 text-green-700'
				case 'processing':
					return 'bg-yellow-100 text-yellow-700'
				case 'cancelled':
					return 'bg-red-100 text-red-700'
				default:
					return 'bg-gray-100 text-gray-700'
			}
		}

		return (
			<span
				className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyles()}`}
			>
				{status}
			</span>
		)
	}

	// Define table columns
	const columns = [
		{
			name: 'Order Id',
			selector: (row) => row.id,
			sortable: true,
			width: '100px',
		},
		{
			name: 'Order Name',
			selector: (row) => row.name,
			sortable: true,
			grow: 1,
		},
		{
			name: 'Customer Name',
			selector: (row) => row.customer,
			sortable: true,
			grow: 2,
		},
		{
			name: 'Customer Email',
			selector: (row) => row.email,
			sortable: true,
			grow: 2,
		},
		{
			name: 'Order date',
			selector: (row) => row.date,
			sortable: true,
			width: '150px',
		},
		{
			name: 'Quantity',
			selector: (row) => row.quantity,
			sortable: true,
			center: true,
		},
		{
			name: 'Status',
			cell: (row) => <StatusBadge status={row.status} />,
			sortable: true,
			width: '120px',
		},
	]

	// Filter data based on search term
	const filteredItems = orders.filter((item) => {
		return (
			item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.status.toLowerCase().includes(searchValue.toLowerCase())
		)
	})

	const handleSearch = (e) => {
		setSearchValue(e.target.value)
		setResetPaginationToggle(!resetPaginationToggle)
	}

	// Table custom styles
	const customStyles = {
		headRow: {
			style: {
				backgroundColor: '#F2DBA9',
				color: '#333',
				fontWeight: '600',
				minHeight: '50px',
			},
		},
		rows: {
			style: {
				minHeight: '50px',
				fontSize: '14px',
			},
			highlightOnHoverStyle: {
				backgroundColor: '#f8f9fa',
				cursor: 'pointer',
			},
		},
		pagination: {
			style: {
				borderTop: '1px solid #eee',
			},
		},
	}

	return (
		<div className="flex flex-col min-h-screen">
			<div className=" flex-1 px-4 py-5 mx-auto w-[80vw]">
				<h1 className="relative text-2xl font-semibold text-center my-6">
					Order Dashboard
					<button className=" absolute right-0 bottom-[-30px] p-2 text-gray-500 hover:text-gray-900 focus:outline-none">
						<Funnel />
					</button>
				</h1>

				<div className="w-full h-[2px] rounded-full bg-gray-600 mb-6" />

				{/* Search and Filter */}
				<div className="flex items-center justify-center mb-6">
					<div className="relative flex items-center w-[80%]">
						<input
							type="text"
							placeholder="Search Order..."
							value={searchValue}
							onChange={handleSearch}
							className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:border-0 focus:ring-amber-400"
						/>
						<div className="absolute right-3 text-gray-500">
							<Search className="hover:text-black hover:cursor-pointer" />
						</div>
					</div>
				</div>

				{/* DataTable */}
				<div className="bg-white rounded-lg shadow">
					<DataTable
						columns={columns}
						data={filteredItems}
						pagination
						paginationResetDefaultPage={resetPaginationToggle}
						customStyles={customStyles}
						highlightOnHover
						pointerOnHover
						persistTableHead
						noDataComponent={
							<div className="p-4 text-center text-gray-500">
								No orders found
							</div>
						}
					/>
				</div>
			</div>
		</div>
	)
}

export default OrderDashboard
