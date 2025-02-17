import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../redux/actions/actionUser' // Adjust the import path as needed
import Transition from '../../utils/Transition'
import Logo from '../../assets/logo.png' // Adjust the import path as needed

export default function RegisterPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [registrationError, setRegistrationError] = useState('')

	const onSubmit = async (data) => {
		// This assumes 'data' comes directly from react-hook-form and contains only email and password
		try {
			await dispatch(registerUser(data)) // 'data' should already be { email: '', password: '' }
			navigate('/')
		} catch (error) {
			setRegistrationError(error.message)
		}
	}

	return (
		<Transition className="flex items-center justify-center h-screen">
			<div className="w-full max-w-md p-8 space-y-3 rounded shadow-md bg-white">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="flex items-center justify-center space-x-4">
						<img
							src={Logo}
							alt="Logo"
							className="cursor-pointer h-9 w-9 md:h-10 md:w-10"
						/>
						<span className="uppercase text-xl text-gray-900">
							Jewelry Store
						</span>
					</div>
					<h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
						Register
					</h2>
					<input
						placeholder="Email"
						{...register('email', {
							required: 'Email is required',
							pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
						})}
						className="w-full px-4 py-2 border rounded leading-tight focus:outline-none focus:border-primary"
					/>
					{errors.email && (
						<span className="text-red-500">{errors.email.message}</span>
					)}
					<input
						placeholder="Password"
						type="password"
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Password must be at least 6 characters long',
							},
						})}
						className="w-full px-4 py-2 border rounded leading-tight focus:outline-none focus:border-primary"
					/>
					{errors.password && (
						<span className="text-red-500">{errors.password.message}</span>
					)}
					<input
						type="submit"
						className="w-full px-4 py-2 font-bold text-white bg-primary rounded hover:bg-primary-dark focus:outline-none focus:shadow-outline"
						value="Register"
					/>
				</form>
				{registrationError && (
					<div className="text-red-500 text-center mt-4">
						{registrationError}
					</div>
				)}
				<p className="text-center text-gray-600">
					Already have an account?{' '}
					<Link to="/login" className="text-primary hover:underline">
						Login
					</Link>
				</p>
			</div>
		</Transition>
	)
}
