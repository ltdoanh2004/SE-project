import Transition from '../../utils/Transition'
import Banner from './Banner'
import Service from './Service'
import Products from './Products'
import InfoSection from './InfoSection'
import BestSeller from './BestSeller'
import Contact from './Contact'
export default function Home() {
	return (
		<Transition className="flex justify-center items-center flex-col">
			<Banner />
			{/* <Service /> */}
			<Products />
			<InfoSection />

			<Contact />
		</Transition>
	)
}
