import React from 'react'
import {
	FaPenFancy,
	FaWrench,
	FaHeadphonesAlt,
	FaGift,
	FaDesktop,
	FaChartLine,
} from 'react-icons/fa'
import logo from '../../assets/logo.png'
import img from '../../assets/image/img2.png'
import { Link } from 'react-router-dom'

const AboutUs = () => {
	return (
		<div className="flex flex-col items-center relative">
			{/* Section: Tiêu đề chính */}
			<section className="w-full text-center bg-accent h-[250px] flex flex-col justify-center items-center space-y-4">
				<h1 className="font-bold text-3xl">Về Chúng Tôi</h1>
				<p>Mỗi sản phẩm đều là một kiệt tác.</p>
			</section>

			{/* Section: Nội dung chia đôi */}
			<section className="flex flex-col md:flex-row w-full md:w-4/5 bg-gray-200 relative -mt-12 shadow-lg rounded overflow-hidden">
				{/* Cột trái: nội dung */}
				<div className="w-full md:w-1/2 p-6">
					<h2 className="font-semibold font-serif text-xl mb-2">
						CHÚNG TÔI LÀ JEIFY JEWELRY
					</h2>
					<hr className="border-black mb-4 w-1/2 border-[1px]" />
					<p className="text-gray-700">Mỗi sản phẩm đều là một kiệt tác.</p>
					<p className="mt-8 text-sm text-gray-700">
						Chúng tôi tự hào mang đến cho bạn những sản phẩm chất lượng cao,
						được chế tác từ những nguyên liệu tốt nhất. Với sự kết hợp hoàn hảo
						giữa thiết kế tinh tế và công nghệ tiên tiến, chúng tôi cam kết mang
						đến cho bạn những sản phẩm không chỉ đẹp mắt mà còn bền bỉ và tiện
						dụng.
					</p>
					<h3 className="text-center my-5 font-serif italic">
						'SỰ HOÀN HẢO TRONG TỪNG CHI TIẾT'
					</h3>
					<p className="text-sm text-gray-700">
						Được chế tạo với sự tỉ mỉ và chú trọng đến từng chi tiết, sản phẩm
						không chỉ đẹp mắt mà còn vô cùng tiện dụng. Các tính năng thông minh
						được tích hợp giúp đơn giản hóa cuộc sống, tiết kiệm thời gian và
						công sức. Sự hài lòng của khách hàng là ưu tiên hàng đầu, vì vậy
						chúng tôi luôn nỗ lực cải tiến để mang đến những giá trị tốt đẹp
						nhất. Lựa chọn sản phẩm này là lựa chọn sự tiện nghi, đẳng cấp và
						hiệu quả dài lâu.
					</p>
					<hr className="border-black my-4 w-1/2 border-[1px]" />
					<p className="font-semibold font-serif">JEIFY JEWELRY</p>
				</div>

				{/* Cột phải: hình ảnh */}
				<div className="w-full md:w-1/2 h-full">
					<img
						src={img}
						alt="Hình ảnh sản phẩm trang sức"
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
								src={logo}
								alt="overlap"
								className="w-full h-full object-center"
							/>
						</div>
					</div>

					{/* Cột phải: lý do và tiêu đề */}
					<div>
						<div className="flex items-center justify-center w-full gap-4 my-6">
							<div className="w-16 border-t border-black"></div>
							<h3 className="text-lg font-bold text-center whitespace-nowrap">
								TẠI SAO CHỌN CHÚNG TÔI
							</h3>
							<div className="w-16 border-t border-black"></div>
						</div>

						<p className="text-sm text-gray-600 mt-2 mb-6 text-center md:text-left">
							Cửa hàng dành cho những người muốn mua ít hơn, nhưng chất lượng
							hơn.
						</p>

						<div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
							<div className="flex items-start gap-2">
								<FaPenFancy className="text-xl" />
								<div>
									<p className="font-bold">THIẾT KẾ SÁNG TẠO</p>
									<p className="text-xs text-gray-500">độc đáo & hiện đại</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaWrench className="text-xl" />
								<div>
									<p className="font-bold">DỄ DÀNG TÙY CHỈNH</p>
									<p className="text-xs text-gray-500">theo ý thích cá nhân</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaHeadphonesAlt className="text-xl" />
								<div>
									<p className="font-bold">HỖ TRỢ 24/7</p>
									<p className="text-xs text-gray-500">luôn sẵn sàng phục vụ</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaGift className="text-xl" />
								<div>
									<p className="font-bold">QUÀ TẶNG THÀNH VIÊN</p>
									<p className="text-xs text-gray-500">ưu đãi đặc biệt</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaDesktop className="text-xl" />
								<div>
									<p className="font-bold">TỐI ƯU HÓA</p>
									<p className="text-xs text-gray-500">trải nghiệm mua sắm</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<FaChartLine className="text-xl" />
								<div>
									<p className="font-bold">PHÁT TRIỂN</p>
									<p className="text-xs text-gray-500">liên tục cải tiến</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ORDER NOW button */}
				<div>
					<Link
						to={'/'}
						className="bg-primary hover:opacity-90 px-8 py-4 font-semibold"
					>
						ĐẶT HÀNG NGAY
					</Link>
				</div>
			</section>
		</div>
	)
}

export default AboutUs
