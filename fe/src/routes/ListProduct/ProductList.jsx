import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Checkbox, Collapse, Slider, Button, Card, Radio } from 'antd'
import './ProductList.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { addToCart } from '../../redux/actions/cartActions'
import { useDispatch } from 'react-redux'
import { ProductService } from '../../services/prod/productService'
import LoadingSpinner from '../../components/common/LoadingSpiner'

const { Panel } = Collapse

const ProductList = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const defaultFilters = {
		jewelryFit: undefined,
		jewelry: {
			type: undefined,
			material: undefined,
			brand: undefined,
			collection: undefined,
			price: {
				min: 100000,
				max: 100000000,
			},
		},
		page: {
			number: 1,
			total: 9,
		},
	}

	const [filters, setFilters] = useState(defaultFilters)
	const [products, setProducts] = useState([])
	const [filteredProducts, setFilteredProducts] = useState(products)
	const [activePanels, setActivePanels] = useState([])
	const [currentImage, setCurrentImage] = useState([])
	const [loading, setLoading] = useState(true)
	const routeFilter = useParams()

	const applyFilters = async () => {
		setLoading(true)
		console.log(filters)
		try {
			const res = await ProductService.getFilteredProductList(filters)
			console.log(res)
			setProducts(res.products)
			setFilteredProducts(res.products)
			setCurrentImage(
				res.products.map(
					(product) => `http://localhost:8000${product.image[0]}`,
				),
			)
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		;(async () => {
			try {
				const { fit, category, value } = routeFilter
				setFilters((prev) => ({
					jewelryFit: fit === 'men' ? 'nam' : fit === 'women' ? 'nữ' : 'trẻ em',
					jewelry: {
						[category]:
							value === 'ring'
								? 'Nhẫn'
								: value === 'necklace'
								? 'Dây chuyền'
								: value === 'earring'
								? 'Bông tai'
								: value === 'bracelet'
								? 'Lắc Vòng'
								: value === 'gold'
								? 'Vàng'
								: value === 'silver'
								? 'Bạc'
								: value === 'platinum'
								? 'Platinum'
								: value === 'daniel_wellington'
								? 'Daniel Wellington'
								: value === 'calvin_klein'
								? 'Calvin Klein'
								: value === 'michael_kors'
								? 'Michael Kors'
								: value === 'fossils'
								? 'Fossils'
								: value === 'titan'
								? 'Titan'
								: value === 'diamond'
								? 'Trang Sức Đính Kim Cương'
								: value === 'ecz'
								? 'Trang Sức Đính ECZ'
								: value === 'italy'
								? 'Trang Sức Công Nghệ Ý'
								: value === 'cz'
								? 'Trang Sức Đính CZ'
								: value === 'big_diamond'
								? 'Kim Cương Viên'
								: value,
						price: defaultFilters.jewelry.price,
					},
				}))
			} catch (error) {
				console.error('Error parsing URL:', error)
			}
		})()
	}, [routeFilter])

	useLayoutEffect(() => {
		;(async () => {
			await applyFilters()
		})()
	}, [
		filters.jewelryFit,
		filters.jewelry.type,
		filters.jewelry.material,
		filters.jewelry.brand,
		filters.jewelry.collection,
	])
	const handleCheckboxChange = (category, value) => {
		setFilters((prev) => {
			const newFilters = { ...prev }
			newFilters.jewelry[category] = value
			return newFilters
		})
	}

	useEffect(() => {
		setCurrentImage(products.map((product) => product.image))
	}, [])

	const handleSliderChange = (value) => {
		setFilters((prev) => ({
			...prev,
			jewelry: {
				...prev.jewelry,
				price: {
					min: value[0],
					max: value[1],
				},
			},
		}))
	}

	const handleAddToCart = (product) => {
		console.log(product)
		// Create a modified product with the discounted price if available
		const modifiedProduct = {
			...product,
			originalPrice: product.price,
			price: product.discount
				? calculateDiscountedPrice(product.price, product.discount)
				: product.price,
		}
		dispatch(addToCart(modifiedProduct))
		navigate('/cart')
	}

	const resetFilters = () => {
		setFilters(defaultFilters)
		setFilteredProducts(products)
	}

	const handleClickCard = (product) => {
		navigate(`/product/${product.id}`)
	}

	// Calculate discounted price helper function
	const calculateDiscountedPrice = (price, discount) => {
		if (!discount) return price
		return price - (price * discount) / 100
	}

	return (
		<div className="flex flex-row justify-around px-40 max-lg:px-5 lg:px-10 lg:gap-4 gap-0 my-20 xl:justify-center">
			<div className="filter-sidebar max-md:w-[300px] max-xl:w-[300px] max-sm:w-[150px]">
				<Collapse activeKey={activePanels} onChange={setActivePanels}>
					<Panel header="Loại" key="1">
						<div>
							<Radio.Group
								className="flex flex-col gap-2"
								value={filters.jewelry.type}
								options={[
									{ value: 'nhẫn', label: 'Nhẫn' },
									{ value: 'dây chuyền', label: 'Dây chuyền' },
									{ value: 'bông tai', label: 'Bông tai' },
									{ value: 'vòng tay', label: 'Lắc Vòng' },
								]}
								onChange={(e) => handleCheckboxChange('type', e.target.value)}
							></Radio.Group>
						</div>
					</Panel>
					<Panel header="Thương hiệu" key="2">
						<div>
							<Radio.Group
								className="flex flex-col gap-2"
								value={filters.jewelry.brand}
								options={[
									{ value: 'Daniel Wellington', label: 'Daniel Wellington' },
									{ value: 'Calvin Klein', label: 'Calvin Klein' },
									{ value: 'Michael Kors', label: 'Michael Kors' },
									{ value: 'Titan', label: 'Titan' },
									{ value: 'Fossils', label: 'Fossils' },
								]}
								onChange={(e) => handleCheckboxChange('brand', e.target.value)}
							></Radio.Group>
						</div>
					</Panel>
					<Panel header="Dòng hàng" key="3">
						<div>
							<Radio.Group
								className="flex flex-col gap-2"
								value={filters.jewelry.collection}
								options={[
									{
										value: 'Trang Sức Đính Kim Cương',
										label: 'Trang Sức Đính Kim Cương',
									},
									{
										value: 'Trang Sức Đính ECZ',
										label: 'Trang Sức Đính ECZ',
									},
									{
										value: 'Trang Sức Công Nghệ Ý',
										label: 'Trang Sức Công Nghệ Ý',
									},
									{ value: 'Trang Sức Đính CZ', label: 'Trang Sức Đính CZ' },
									{ value: 'Kim Cương Viên', label: 'Kim Cương Viên' },
								]}
								onChange={(e) =>
									handleCheckboxChange('collection', e.target.value)
								}
							></Radio.Group>
						</div>
					</Panel>
					<Panel header="Chất liệu" key="4">
						<div>
							<Radio.Group
								className="flex flex-col gap-2"
								value={filters.jewelry.material}
								options={[
									{ value: 'vàng', label: 'Vàng' },
									{ value: 'bạc', label: 'Bạc' },
									{ value: 'platinum', label: 'Platinum' },
								]}
								onChange={(e) =>
									handleCheckboxChange('material', e.target.value)
								}
							></Radio.Group>
						</div>
					</Panel>
					<Panel header="Giá" key="5">
						<Slider
							range
							min={100000}
							max={100000000}
							defaultValue={[100000, 100000000]}
							value={[filters.jewelry.price.min, filters.jewelry.price.max]}
							step={100000}
							onChange={handleSliderChange}
						/>
						<div>
							Giá: {filters.jewelry.price.min.toLocaleString()} VND -{' '}
							{filters.jewelry.price.max.toLocaleString()} VND
						</div>
					</Panel>
				</Collapse>
				<div style={{ display: 'flex', justifyContent: 'space-around' }}>
					<Button
						className="bg-inherit "
						onClick={resetFilters}
						style={{
							marginTop: '10px',
							marginLeft: '10px',
							width: '100px',
						}}
						disabled={loading}
					>
						Đặt lại
					</Button>
					<Button
						className="bg-primary hover:!bg-secondary text-black"
						type="primary"
						onClick={applyFilters}
						style={{
							marginTop: '10px',
							width: '100px',
						}}
						loading={loading}
					>
						{loading ? 'Đang lọc' : 'Lọc'}
					</Button>
				</div>
			</div>

			<div className="flex-1 min-h-screen">
				{loading ? (
					<div className="flex justify-center items-center min-h-[400px]">
						<LoadingSpinner />
						<p className="ml-4 text-gray-600">Đang tải sản phẩm...</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-lg:grid-cols-2">
						{filteredProducts.length > 0 ? (
							filteredProducts.map((product, index) => {
								return (
									<Card
										onClick={() => handleClickCard(product)}
										key={product.id}
										style={{ textAlign: 'center' }}
										className="hover:cursor-pointer 2xl:w-[300px] xl:w-[300px] max-lg:w-[250px] lg:w-[240px] max-md:w-[250px] max-sm:w-[150px]"
										onMouseEnter={() =>
											setCurrentImage((prev) => ({
												...prev,
												[index]: `http://localhost:8000${product.image[1]}`,
											}))
										}
										onMouseLeave={() =>
											setCurrentImage((prev) => ({
												...prev,
												[index]: `http://localhost:8000${product.image[0]}`,
											}))
										}
									>
										<img
											src={currentImage[index]}
											alt={product.name}
											style={{
												width: '100%',
												height: '150px',
												objectFit: 'cover',
											}}
										/>
										<p style={{ margin: '10px 0' }}>{product.name}</p>
										{/* Price display with discount */}
										<div className="my-3">
											{product.discount ? (
												<div className="flex flex-wrap items-center justify-center gap-2">
													<span className="text-gray-500 line-through">
														{new Number(product.price).toLocaleString()} VND
													</span>
													<span className="bg-[#C48C46] text-white text-xs px-2 py-1 rounded">
														-{product.discount}%
													</span>
													<span className="font-bold text-[#C48C46]">
														{new Number(
															calculateDiscountedPrice(
																product.price,
																product.discount,
															),
														).toLocaleString()}{' '}
														VND
													</span>
												</div>
											) : (
												<p className="font-bold text-[#C48C46]">
													{new Number(product.price).toLocaleString()} VND
												</p>
											)}
										</div>
										<Button
											className="bg-primary hover:!bg-secondary text-black"
											type="primary"
											onClick={(e) => {
												e.stopPropagation()
												handleAddToCart(product)
											}}
										>
											Thêm vào giỏ hàng
										</Button>
									</Card>
								)
							})
						) : (
							<div className="col-span-3 text-center py-10">
								<p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default ProductList
