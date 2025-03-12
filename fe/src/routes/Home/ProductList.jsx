import React, { useState } from 'react'
import { Checkbox, Collapse, Slider, Button, Card } from 'antd'
import './ProductList.css'

const { Panel } = Collapse

const products = [
	{
		id: 1,
		name: 'Nhẫn Vàng',
		brand: 'Daniel Wellington',
		collection: 'Trang Sức Đính Kim Cương',
		material: 'Vàng',
		price: 5000000,
		image:
			'https://cdn.pnj.io/images/detailed/237/sp-gnxm00y005207-nhan-vang-dinh-da-ecz-pnj-1.png',
		hoverImage:
			'https://cdn.pnj.io/images/detailed/237/sp-gnxm00y005207-nhan-vang-dinh-da-ecz-pnj-2.png',
	},
	{
		id: 2,
		name: 'Dây Chuyền Bạc',
		brand: 'Calvin Klein',
		collection: 'Trang Sức Đính ECZ',
		material: 'Bạc',
		price: 2000000,
		image:
			'https://cdn.pnj.io/images/detailed/212/sp-smxmxmw060063-mat-day-chuyen-bac-dinh-da-pnjsilver-1.png',
		hoverImage:
			'https://cdn.pnj.io/images/detailed/212/sp-smxmxmw060063-mat-day-chuyen-bac-dinh-da-pnjsilver-2.png',
	},
	{
		id: 3,
		name: 'Bông Tai Platinum',
		brand: 'Michael Kors',
		collection: 'Trang Sức Công Nghệ Ý',
		material: 'Platinum',
		price: 8000000,
		image:
			'https://cdn.pnj.io/images/detailed/203/sp-sb0000w000120-bong-tai-bac-style-by-pnj-love-potion-1.png',
		hoverImage:
			'https://cdn.pnj.io/images/detailed/203/sp-sb0000w000120-bong-tai-bac-style-by-pnj-love-potion-2.png',
	},
	{
		id: 4,
		name: 'Nhẫn Vàng',
		brand: 'Daniel Wellington',
		collection: 'Trang Sức Đính Kim Cương',
		material: 'Vàng',
		price: 5000000,
		image:
			'https://cdn.pnj.io/images/detailed/237/sp-gnxm00y005207-nhan-vang-dinh-da-ecz-pnj-1.png',
		hoverImage:
			'https://cdn.pnj.io/images/detailed/237/sp-gnxm00y005207-nhan-vang-dinh-da-ecz-pnj-2.png',
	},
	{
		id: 5,
		name: 'Dây Chuyền Bạc',
		brand: 'Calvin Klein',
		collection: 'Trang Sức Đính ECZ',
		material: 'Bạc',
		price: 2000000,
		image:
			'https://cdn.pnj.io/images/detailed/212/sp-smxmxmw060063-mat-day-chuyen-bac-dinh-da-pnjsilver-1.png',
		hoverImage:
			'https://cdn.pnj.io/images/detailed/212/sp-smxmxmw060063-mat-day-chuyen-bac-dinh-da-pnjsilver-2.png',
	},
	{
		id: 6,
		name: 'Bông Tai Platinum',
		brand: 'Michael Kors',
		collection: 'Trang Sức Công Nghệ Ý',
		material: 'Platinum',
		price: 8000000,
		image:
			'https://cdn.pnj.io/images/detailed/203/sp-sb0000w000120-bong-tai-bac-style-by-pnj-love-potion-1.png',
		hoverImage:
			'https://cdn.pnj.io/images/detailed/203/sp-sb0000w000120-bong-tai-bac-style-by-pnj-love-potion-2.png',
	},
]

const FilterSidebar = () => {
	const defaultFilters = {
		type: [],
		brand: [],
		collection: [],
		material: [],
		price: [100000, 100000000],
	}

	const [filters, setFilters] = useState(defaultFilters)
	const [filteredProducts, setFilteredProducts] = useState(products)
	const [activePanels, setActivePanels] = useState([]) // Mặc định tất cả đóng

	const handleCheckboxChange = (category, value) => {
		setFilters((prev) => {
			const newValues = prev[category].includes(value)
				? prev[category].filter((item) => item !== value)
				: [...prev[category], value]
			return { ...prev, [category]: newValues }
		})
	}

	const handleSliderChange = (value) => {
		setFilters((prev) => ({ ...prev, price: value }))
	}

	const applyFilters = () => {
		setFilteredProducts(
			products.filter(
				(product) =>
					(filters.type.length === 0 ||
						filters.type.includes(product.name.split(' ')[0])) &&
					(filters.brand.length === 0 ||
						filters.brand.includes(product.brand)) &&
					(filters.collection.length === 0 ||
						filters.collection.includes(product.collection)) &&
					(filters.material.length === 0 ||
						filters.material.includes(product.material)) &&
					product.price >= filters.price[0] &&
					product.price <= filters.price[1],
			),
		)
	}

	const resetFilters = () => {
		setFilters(defaultFilters)
		setFilteredProducts(products)
	}

	return (
		<div className="flex flex-row justify-around px-40 my-20">
			<div className="filter-sidebar">
				<Collapse activeKey={activePanels} onChange={setActivePanels}>
					<Panel header="Loại" key="1">
						{['Nhẫn', 'Dây chuyền', 'Bông tai', 'Lắc Vòng'].map((item) => (
							<div key={item}>
								<Checkbox onChange={() => handleCheckboxChange('type', item)}>
									{item}
								</Checkbox>
							</div>
						))}
					</Panel>
					<Panel header="Thương hiệu" key="2">
						{[
							'Daniel Wellington',
							'Calvin Klein',
							'Michael Kors',
							'Titan',
							'Fossils',
						].map((item) => (
							<div key={item}>
								<Checkbox onChange={() => handleCheckboxChange('brand', item)}>
									{item}
								</Checkbox>
							</div>
						))}
					</Panel>
					<Panel header="Dòng hàng" key="3">
						{[
							'Trang Sức Đính Kim Cương',
							'Trang Sức Đính ECZ',
							'Trang Sức Công Nghệ Ý',
							'Trang Sức Đính CZ',
							'Kim Cương Viên',
						].map((item) => (
							<div key={item}>
								<Checkbox
									onChange={() => handleCheckboxChange('collection', item)}
								>
									{item}
								</Checkbox>
							</div>
						))}
					</Panel>
					<Panel header="Chất liệu" key="4">
						{['Vàng', 'Bạc', 'Platinum'].map((item) => (
							<div key={item}>
								<Checkbox
									onChange={() => handleCheckboxChange('material', item)}
								>
									{item}
								</Checkbox>
							</div>
						))}
					</Panel>
					<Panel header="Giá" key="5">
						<Slider
							range
							min={100000}
							max={100000000}
							step={100000}
							value={filters.price}
							onChange={handleSliderChange}
						/>
						<div>
							Giá: {filters.price[0].toLocaleString()} VND -{' '}
							{filters.price[1].toLocaleString()} VND
						</div>
					</Panel>
				</Collapse>
				<div style={{ display: 'flex', justifyContent: 'space-around' }}>
					<Button
					className='bg-inherit '
						onClick={resetFilters}
						style={{
							marginTop: '10px',
							marginLeft: '10px',
							width: '100px',
						}}
					>
						Đặt lại
					</Button>
					<Button
					className='bg-primary hover:!bg-secondary text-black'
						type="primary"
						onClick={applyFilters}
						style={{
							marginTop: '10px',
							width: '100px',
						}}
					>
						Lọc
					</Button>
				</div>
			</div>
			<div className="product-list">
				{filteredProducts.map((product) => {
					const [currentImage, setCurrentImage] = useState(product.image)

					return (
						<Card
							key={product.id}
							style={{ width: 350, height: 350, textAlign: 'center' }}
						>
							<img
								src={currentImage}
								alt={product.name}
								style={{ width: '100%', height: '150px', objectFit: 'cover' }}
								onMouseEnter={() =>
									setCurrentImage(product.hoverImage || product.image)
								}
								onMouseLeave={() => setCurrentImage(product.image)}
							/>
							<p style={{ margin: '10px 0' }}>{product.name}</p>
							<p
								style={{
									fontWeight: 'bold',
									color: '#C48C46',
									margin: '10px 0',
								}}
							>
								{product.price.toLocaleString()} VND
							</p>
							<Button
								className='bg-primary hover:!bg-secondary text-black'
								type="primary"
							>
								Thêm vào giỏ hàng
							</Button>
						</Card>
					)
				})}
			</div>
		</div>
	)
}

export default FilterSidebar
