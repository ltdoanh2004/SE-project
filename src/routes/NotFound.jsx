import Transition from '../utils/Transition'

export default function NotFound() {
	return (
		<Transition className="flex justify-center items-center flex-col">
			<h2 className="text-3xl font-bold">Oops! 404</h2>
			<h1 className="text-5xl text-gray-600">Page not found</h1>
		</Transition>
	)
}
