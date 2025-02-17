import Transition from '../../utils/Transition' // Ensure this import path is correct
import { FaPaperPlane } from 'react-icons/fa'

export default function Contact() {
	return (
		<Transition className="flex items-center justify-center flex-col w-full">
			<div className="bg-[#C6A969] text-white p-10 w-full">
				<div className="container mx-auto">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="md:flex-1">
							<h3 className="text-lg md:text-xl font-bold">Do You Have Questions?</h3>
							<p className="mt-2">
								We will help you to grow your career and growth.
							</p>
						</div>
						<div className="md:flex-1 mt-4 md:mt-0">
    <div className="flex">
        <input
            type="text"
            aria-label="Amount (to the nearest dollar)"
            className="p-2 flex-grow text-black rounded-l-md" 
            placeholder="Enter your email"
        />
        <button className="bg-white text-[#C6A969] p-2 rounded-r-md"> 
            <FaPaperPlane />
        </button>
    </div>
</div>

					</div>
				</div>
			</div>
		</Transition>
	)
}
