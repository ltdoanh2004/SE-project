import Transition from '../../utils/Transition'
import bannerImage from '../../assets/image/banner2.png'

export default function Banner() {
	return (
		<Transition className="flex  items-center flex-col">
			<div
				className="banner-container bg-cover bg-center h-[80vh] w-[100vw] flex items-center"
				style={{ backgroundImage: `url(${bannerImage})` }}
			>
				{/* <div className="container mx-auto px-4">
					<p className="text-xl py-3">
						<large>TRANG CHỦ</large>
					</p>
					<h1 className="font-normal text-5xl py-3">
					JEIFY  <span>JEWELERY</span>
						<br /> STORE
					</h1>
					<p className='py-3'>Ưu đãi độc quyền tại Jeyfy Store</p>
                    <button className="mt-4 py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-black">
                        Shop Now
                    </button>
				</div> */}
			</div>
		</Transition>
	)
}
