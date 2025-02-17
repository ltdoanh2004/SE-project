import Slider from 'react-slick'
import Transition from '../../utils/Transition' // Ensure this import path is correct
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Dummy data from API
const products = [
	{
		name: 'Vòng tay',
		img: 'https://cdn.pnj.io/images/detailed/175/sp-gvddddh000031-vong-tay-kim-cuong-vang-14k-pnj-family-infinity-1.png',
	},
	{
		name: 'Bông tai',
		img: 'https://cdn.pnj.io/images/detailed/201/sp-sbxmxmw060201-bong-tai-bac-dinh-da-style-by-pnj-1.png',
	},
	{
		name: 'Dây chuyền',
		img: 'https://cdn.pnj.io/images/detailed/201/sp-gmddddw060389-mat-day-chuyen-kim-cuong-vang-trang-14k-pnj-1.png',
	},
	{
		name: 'Nhẫn',
		img: 'https://cdn.pnj.io/images/detailed/82/gndrwb74179.106-nhan-pnj-vang-trang-10k-dinh-da-ecz-01a.png',
	}
]

const Product = ({ product }) => (
	<div className="relative m-2 md:m-4 bg-blue-50 p-1 rounded-lg">
		<div className="overflow-hidden">
			<img
				className="w-full h-80 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
				src={product.img}
				alt={product.name}
			/>
		</div>
		<div className="absolute flex justify-between items-center w-full bottom-1 p-1 text-gray-800 overflow-hidden">
			<h5 className='pb-5 pl-5'>{product.name}</h5>
		</div>
	</div>
)

export default function Products() {
	let settings = {
		dots: false,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					dots: false,
				},
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true,
				},
			},
		],
	}

	return (
		<div className="container mx-auto">
			<div className="text-center my-12">
				<h1 className="text-2xl font-normal text-yellow-600">
					Top Accessories
				</h1>
        <h2 className="md:text-lg text-sm text-gray-500 tracking-wider">
    Enim praesent elementum facilisis leo vel
</h2>

			</div>
			<Slider {...settings}>
				{products.map((product, index) => (
					<Product key={index} product={product} />
				))}
			</Slider>
		</div>
	)
}
