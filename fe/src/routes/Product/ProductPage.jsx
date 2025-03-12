import React, { useState } from 'react'
import RingImage from '../../assets/image/NhanVang.png'

const ProductPage = () => {
	const [quantity, setQuantity] = useState(1)
	const [selectedSize, setSelectedSize] = useState(null)

	const handleIncrease = () => setQuantity(quantity + 1)
	const handleDecrease = () => {
		if (quantity > 1) setQuantity(quantity - 1)
	}

	return (
		<div className="w-full max-w-screen-xl mx-auto p-6 min-h-screen">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Hình ảnh sản phẩm */}
				<div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
					<img
						src={RingImage}
						alt="Chiếc nhẫn vàng"
						className="w-full h-full object-contain"
					/>
				</div>

				{/* Thông tin sản phẩm */}
				<div>
					<p className="text-sm text-gray-500">Jeify Jewelry</p>
					<h1 className="text-2xl font-bold mt-1">Nhẫn Vàng 18k</h1>

					{/* Chọn size */}
					<div className="mt-6">
						<span className="px-6 py-3 w-20 h-8 flex items-center justify-center bg-[rgba(242,219,169,1)] text-black rounded-full">
							Size
						</span>

						<div className="flex space-x-2 mt-4">
							{[5, 6, 7, 8, 9].map((size) => (
								<button
									key={size}
									onClick={() => setSelectedSize(size)}
									className={`px-8 py-0 border rounded-3xl ${
										selectedSize === size
											? 'text-white'
											: 'bg-gray-100 text-gray-700'
									}`}
									style={{
										backgroundColor:
											selectedSize === size ? 'rgba(242, 219, 169, 1)' : '',
										color: selectedSize === size ? '#000' : '',
									}}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					{/* Giá sản phẩm */}
					<p className="text-2xl font-semibold mt-10">9.700.000 VND</p>

					<div className="mt-10">
						<div className="flex items-center justify-between">
							{/* Tăng giảm số lượng */}
							<div className="flex items-center justify-between rounded-lg space-x-4 w-36 border-2">
								<button onClick={handleDecrease} className="px-3 py-1">
									-
								</button>
								<span>{quantity}</span>
								<button onClick={handleIncrease} className="px-3 py-1">
									+
								</button>
							</div>
							{/* Nút mua hàng */}
							<button className="w-[70%] bg-gray-300 opacity-90 hover:opacity-100 py-2 rounded-md">
								Thêm vào giỏ hàng
							</button>
						</div>
						<button
							className="w-full text-white py-2 rounded-md mt-4 hover:!bg-secondary hover:!text-white"
							style={{
								backgroundColor: 'rgba(242, 219, 169, 1)',
								color: '#000',
							}}
						>
							Mua ngay
						</button>
					</div>
					<hr className="h-1 w-full bg-black opacity-40 rounded-full mt-6" />
					<div className="pt-6 text-lg font-bold">Thông tin sản phẩm</div>
					<div className="overflow-hidden w-full h-40 mt-2">
						Helios Black Silver là hạng cao nhất trong các dòng sản phẩm của
						Helios. Các chế tác thuộc dòng này có hàm lượng bạc lớn, đòi hỏi độ
						tỉ mỉ, cầu kỳ cao hơn bất cứ sản phẩm nào khác. Các chi tiết chạm
						khắc tinh xảo trên chế tác được thực hiện hoàn toàn thủ công, do vậy
						số lượng có thể sản xuất cũng rất hạn chế.{' '}
					</div>
				</div>
			</div>

			{/* Mô tả sản phẩm */}
			<div className="mt-10 border-t-2 border-black pt-6">
				<h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
				<p className="text-gray-700 mt-2">
					Trọng lượng tham khảo: 7.94571 phân <br />
					Loại đá chính: Xoàn mỹ <br />
					Kích thước đá chính (tham khảo): 3.0 <br />
					Loại đá phụ: Không gắn đá <br />
					Số viên đá chính: 6 <br />
					Giới tính: Nữ <br />
					Thương hiệu: Jeify
				</p>

				{/* Hướng dẫn chọn size */}
				{/* Hướng dẫn chọn size */}
				<div className="mt-4">
					<h3 className="font-semibold text-lg">Hướng dẫn chọn size:</h3>

					{/* Bảng size nhẫn */}
					<div className="mt-2 overflow-x-auto">
						<table className="w-full border-collapse border border-gray-600 text-left text-white bg-gray-800">
							<thead>
								<tr className="bg-gray-900">
									<th className="border border-gray-600 px-4 py-2">
										Chu vi ngón tay (mm)
									</th>
									<th className="border border-gray-600 px-4 py-2">
										Size nhẫn
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border border-gray-600 px-4 py-2">44 - 46</td>
									<td className="border border-gray-600 px-4 py-2">Size 5</td>
								</tr>
								<tr>
									<td className="border border-gray-600 px-4 py-2">47 - 49</td>
									<td className="border border-gray-600 px-4 py-2">Size 6</td>
								</tr>
								<tr>
									<td className="border border-gray-600 px-4 py-2">50 - 52</td>
									<td className="border border-gray-600 px-4 py-2">Size 7</td>
								</tr>
								<tr>
									<td className="border border-gray-600 px-4 py-2">53 - 55</td>
									<td className="border border-gray-600 px-4 py-2">Size 8</td>
								</tr>
								<tr>
									<td className="border border-gray-600 px-4 py-2">56 - 58</td>
									<td className="border border-gray-600 px-4 py-2">Size 9</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductPage
