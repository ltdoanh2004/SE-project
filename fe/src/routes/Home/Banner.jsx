import Transition from '../../utils/Transition'
import bannerImage from '../../assets/image/banner2.png'

export default function Banner() {
	return (
		<Transition className="flex items-center flex-col">
			<div
				className="bg-center h-[80vh] w-[100vw] flex justify-center items-center bg-cover bg-no-repeat"
				style={{ backgroundImage: `url(${bannerImage})` }}
			>
				{/* <div className="container mx-auto px-4">
					<p className="text-xl py-3">
						<large>TRANG CHỦ</large>
					</p>
					<h1 className="font-normal text-5xl py-3">
					<br /> STORE
					JEIFY  <span>JEWELERY</span>
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
