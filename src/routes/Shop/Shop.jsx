import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Transition from '../../utils/Transition'
import Product from './Product'
export default function Shop() {
	const navigate = useNavigate()
	const isLoggedIn = useSelector((state) => !!state.user.userData?.email)

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/account')
		}
	}, [isLoggedIn, navigate])

	return (
		<Transition className="flex flex-col items-center justify-center">
			<Product />
		</Transition>
	)
}
