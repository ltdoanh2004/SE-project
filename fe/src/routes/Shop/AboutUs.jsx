import React from 'react'
import {
	FaPenFancy,
	FaWrench,
	FaHeadphonesAlt,
	FaGift,
	FaDesktop,
	FaChartLine,
} from 'react-icons/fa'

const AboutUs = () => {
	return (
		<div className="flex flex-col items-center relative">
			{/* Section: Tiêu đề chính */}
			<section className="w-full text-center bg-accent h-[250px] flex flex-col justify-center items-center space-y-4">
				<h1 className="font-bold text-3xl">About Us</h1>
				<p>A store for people who want to buy less, but better.</p>
			</section>

			{/* Section: Nội dung chia đôi */}
			<section className="flex flex-col md:flex-row w-full md:w-4/5 bg-gray-200 relative -mt-12 shadow-lg rounded overflow-hidden">
				{/* Cột trái: nội dung */}
				<div className="w-full md:w-1/2 p-6">
					<h2 className="font-semibold font-serif text-xl mb-2">
						WE ARE JEIFY JEWELRY
					</h2>
					<hr className="border-black mb-4 w-1/2 border-[1px]" />
					<p className="text-gray-700">
						A store for people who want to buy less, but better.
					</p>
					<p className="mt-8 text-sm text-gray-700">
						Mô tả ngắn gọn về sản phẩm Mô tả ngắn gọn về sản phẩm Mô tả ngắn gọn
						về sản phẩm Mô tả ngắn gọn về sản phẩm Mô tả ngắn gọn về sản phẩm Mô
						tả ngắn gọn về sản phẩm Mô tả ngắn gọn về sản phẩm Mô tả ngắn gọn về
						...
					</p>
					<h3 className="text-center my-5 font-serif italic">
						'LOREM IPSUM DOLOR SIT AMET'
					</h3>
					<p className="text-sm text-gray-700">
						Mô tả ngắn gọn về sản phẩm Mô tả ngắn gọn về sản phẩm Mô tả ngắn gọn
						về sản phẩm Mô tả ngắn gọn về sản phẩm Mô tả ngắn gọn về sản phẩm Mô
						tả ngắn gọn về sản phẩm Mô tả ngắn gọn về sản phẩm...
					</p>
					<hr className="border-black my-4 w-1/2 border-[1px]" />
					<p className="font-semibold font-serif">JEIFY JEWELRY</p>
				</div>

				{/* Cột phải: hình ảnh */}
				<div className="w-full md:w-1/2 h-full">
					<img
						src="https://via.placeholder.com/400x300.png?text=Jewelry+Image"
						alt="Jewelry product image"
						className="object-cover w-full h-full"
					/>
				</div>
			</section>

			{/* Section: Why Choose Us */}
			<section className="w-full px-8 py-12 flex flex-col items-center space-y-10">
				<div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl gap-12 items-center">
					{/* Cột trái: hình ảnh */}
					<div className="relative w-full h-[200px] flex items-center">
						{/* Khối màu xám bên trái */}
						<div className="w-[60%] h-full bg-gray-300"></div>

						{/* Hình ảnh bị chồng một phần lên khối xám */}
						<div className="absolute left-[55%] w-[200px] h-[150px] bg-white shadow-md flex items-center justify-center">
							<img
								src="https://via.placeholder.com/150"
								alt="overlap"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* Cột phải: lý do và tiêu đề */}
					<div>
						<div className="flex items-center justify-center w-full gap-4 my-6">
							<div className="w-16 border-t border-black"></div>
							<h3 className="text-lg font-bold text-center whitespace-nowrap">
								WHY CHOOSE US
							</h3>
							<div className="w-16 border-t border-black"></div>
						</div>

						<p className="text-sm text-gray-600 mt-2 mb-6 text-center md:text-left">
							A store for people who want to buy less, but better.
						</p>

						<div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
							<div className="flex items-start gap-2">
								<FaPenFancy className="text-xl" />
								<div>
									<p className="font-bold">CREATIVE DESIGN</p>
									<p className="text-xs text-gray-500">describe</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaWrench className="text-xl" />
								<div>
									<p className="font-bold">EASY TO CUSTOMIZE</p>
									<p className="text-xs text-gray-500">describe</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaHeadphonesAlt className="text-xl" />
								<div>
									<p className="font-bold">SUPPORT 24/7</p>
									<p className="text-xs text-gray-500">describe</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaGift className="text-xl" />
								<div>
									<p className="font-bold">GIFT FOR MEMBER</p>
									<p className="text-xs text-gray-500">describe</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaDesktop className="text-xl" />
								<div>
									<p className="font-bold">OPTIMIZATION</p>
									<p className="text-xs text-gray-500">describe</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaChartLine className="text-xl" />
								<div>
									<p className="font-bold">DEVELOPMENT</p>
									<p className="text-xs text-gray-500">describe</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ORDER NOW button */}
				<div>
					<button className="bg-primary hover:opacity-90 px-8 py-2 font-semibold">
						ORDER NOW
					</button>
				</div>
			</section>
		</div>
	)
}

export default AboutUs
