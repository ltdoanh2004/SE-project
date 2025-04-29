// Product.jsx
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../redux/actions/actionProduct'
import Transition from '../../utils/Transition'

export default function Product() {
	const dispatch = useDispatch()
    const navigate = useNavigate()
	const { loading, products, error } = useSelector((state) => state.product) // Adjust based on your state structure

	useEffect(() => {
		dispatch(fetchProducts())
	}, [dispatch])

    const handleCustomNowClick = () => {
        navigate('/jewelry'); // Navigate to the jewelry page
    };
	return (
		<Transition className="flex flex-col items-center justify-center">
			<h1 className="text-2xl font-semibold text-center my-4">HOT TREND PRODUCTS</h1>
			{loading && <p>Loading...</p>}
			{error && <p className="text-red-500">{error}</p>}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{products.map((product) => (
					<div
						key={product.id}
						className="bg-white p-4 rounded-lg shadow-md text-center"
					>
						<img
							src={product.img}
							alt={product.name}
							className="w-full h-auto object-cover mb-4"
						/>
						<h2 className="mb-2 font-bold">{product.name}</h2>
						<p className="text-gray-600">{product.price}</p>
						<button
							style={{ backgroundColor: '#C6A969' }}
							className="text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            onClick={handleCustomNowClick}
						>
							Custom Now
						</button>
					</div>
				))}
			</div>
		</Transition>
	)
}
