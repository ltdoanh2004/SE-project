import Transition from '../../utils/Transition'
import Banner from './Banner'
import Service from './Service'
import Products from './Products'
import InfoSection from './InfoSection'
import BestSeller from './BestSeller'
import Contact from './Contact'
<<<<<<< HEAD
=======
import ProductList from './ProductList'
>>>>>>> 3be7f89 (update fe)
export default function Home() {
	return (
		<Transition className="flex justify-center items-center flex-col">
			<Banner />
			{/* <Service /> */}
<<<<<<< HEAD
=======
			<ProductList />
>>>>>>> 3be7f89 (update fe)
			<Products />
			<InfoSection />

			<Contact />
		</Transition>
	)
}
