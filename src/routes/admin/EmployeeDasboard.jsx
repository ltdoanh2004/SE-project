import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Funnel, Search } from 'lucide-react'

const EmployeeDashboard = () => {
	const [searchValue, setSearchValue] = useState('')
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

	// Sample employee data
	const employees = [
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Seller',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Marketing',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Seller',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Marketing',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Seller',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Marketing',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Sale',
			startDate: '22-03-2025',
			role: 'Seller',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Marketing',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Seller',
			status: 'Active',
		},
		{
			id: 1,
			name: 'Đào Hữu Hoài',
			email: 'daohuuhoai2655@gmail.com',
			phone: '0342643753',
			department: 'Marketing',
			startDate: '22-03-2025',
			role: 'Marketing',
			status: 'Active',
		},
	]

	// Status badge renderer
	const StatusBadge = ({ status }) => {
		const getStatusStyles = () => {
			switch (status.toLowerCase()) {
				case 'active':
					return 'bg-green-100 text-green-700'
				case 'blocked':
					return 'bg-red-300 text-gray-700'
				case 'inactive':
					return 'bg-red-100 text-red-700'
				case 'break':
					return 'bg-yellow-100 text-yellow-700'
                case 'pending':
                    return 'bg-yellow-200 text-yellow-700'
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
			name: 'Id',
			selector: (row) => row.id,
			sortable: true,
			width: '60px',
		},
		{
			name: 'Full Name',
			selector: (row) => row.name,
			sortable: true,
			grow: 1,
		},
		{
			name: 'Customer Email',
			selector: (row) => row.email,
			sortable: true,
			grow: 2,
		},
		{
			name: 'Phone Number',
			selector: (row) => row.phone,
			sortable: true,
		},
		{
			name: 'Department',
			selector: (row) => row.department,
			sortable: true,
		},
		{
			name: 'Start date',
			selector: (row) => row.startDate,
			sortable: true,
		},
		{
			name: 'Role',
			selector: (row) => row.role,
			sortable: true,
		},
		{
			name: 'Status',
			cell: (row) => <StatusBadge status={row.status} />,
			sortable: true,
			width: '120px',
		},
	]

	// Filter data based on search term
	const filteredItems = employees.filter((item) => {
		return (
			item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.department.toLowerCase().includes(searchValue.toLowerCase()) ||
			item.role.toLowerCase().includes(searchValue.toLowerCase()) ||
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
			<div className="flex-1 px-4 py-5 mx-auto w-[80vw]">
				<h1 className="relative text-2xl font-semibold text-center my-6">
					Employee Dashboard
					<button className="absolute right-0 bottom-[-30px] p-2 text-gray-500 hover:text-gray-900 focus:outline-none">
						<Funnel />
					</button>
				</h1>

				<div className="w-full h-[2px] rounded-full bg-gray-600 mb-6" />

				{/* Search and Filter */}
				<div className="flex items-center justify-center mb-6">
					<div className="relative flex items-center w-[80%]">
						<input
							type="text"
							placeholder="Search Employee..."
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
								No employees found
							</div>
						}
					/>
				</div>
			</div>
		</div>
	)
}

export default EmployeeDashboard
