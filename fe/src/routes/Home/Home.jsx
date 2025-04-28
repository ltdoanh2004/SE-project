import Transition from '../../utils/Transition'
import Banner from './Banner'
import Service from './Service'
import Products from './Products'
import InfoSection from './InfoSection'
import BestSeller from './BestSeller'
import Contact from './Contact'
import ProductList from '../ListProduct/ProductList'
import { Link } from 'react-router-dom'
export default function Home() {
	return (
		<Transition className="flex flex-col items-center justify-center w-full">
			<Banner />
			{/* <Service /> */}
			<BestSeller />
			<Products />
			<InfoSection />

			<Link to={'/aboutus'} className='p-4 mb-3 w-40 text-center rounded-2xl bg-primary'>Về chúng tôi</Link>
			<Contact />
		</Transition>
	)
}
