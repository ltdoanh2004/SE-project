import img from '../../assets/image/img1.png' // Update the path if necessary
import Transition from '../../utils/Transition' // Ensure this import path is correct

const BestSeller = () => {
	return (
		<div className="my-8 bg-[#fbf9f5]">
			<div className="container mx-auto py-12 text-center">
				<h1 className="text-2xl font-normal text-[#C6A969]">
					Latest Collections
				</h1>
				{/* <h2 className="md:text-4xl lg:text-5xl font-bold text-gray-500 mt-4 mb-10">
					Spring Summer Clearance <br /> Women’s Sales
				</h2> */}
				<br/>
				<div className="flex flex-wrap items-center justify-center gap-10">
					<img className="md:w-1/2 w-full" src={img} alt="Women fashion" />
					<div className="w-full md:w-1/2">
						<div className="max-w-md mx-auto">
							{/* <h2 className="text-3xl font-semibold">Deals of the day</h2>
							<p className="text-gray-500 mt-4">Expired</p>
							<h3 className="text-2xl mt-4 mb-6">Evolution Jewelry</h3>
							<div className="text-lg mb-6">
								<span className="font-semibold">$250.00</span>
								<span className="text-gray-500 line-through ml-4">$298.00</span>
							</div> */}
							<button className="bg-[#C6A969] text-white font-bold py-3 px-8 rounded transition duration-300 hover:bg-[#C6A969]">
								Shop Now
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function BestSellerPage() {
	return (
		<Transition className="flex items-center justify-center min-h-screen">
			<BestSeller />
		</Transition>
	)
}
