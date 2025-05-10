import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../redux/actions/actionUser' // Adjust the import path as needed
import Transition from '../../utils/Transition'
import Logo from '../../assets/logo.png' // Adjust the import path as needed
import { UserAuthenticationService } from '../../services/user/auth/userAuthentication'
import { CookieService } from '../../utils/CookieService'
import { TokenService } from '../../utils/tokenService'
import { UserPublicInfoProvider } from '../../components/provider/provider'

export default function RegisterPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [registrationError, setRegistrationError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (data) => {
		setIsLoading(true)
		setRegistrationError('')

		try {
			await UserAuthenticationService.signUp(data)
				.then((res) => {
					console.log(res)
					const tokenPayload = TokenService.decodeToken(res.token)
					const tokenExp = new Date(tokenPayload.exp * 1000)
					CookieService.setCookie('token', res.token, tokenExp)
					localStorage.setItem('userName', res.user.userName)
					navigate('/')
					window.location.reload()
				})
				.catch((error) => {
					console.log(error)
					if (error.response) {
						// Server responded with an error status
						setRegistrationError(
							error.response.data.message ||
								'Registration failed. Please try again.',
						)
					} else if (error.request) {
						// Request was made but no response
						setRegistrationError(
							'No response from server. Please check your connection and try again.',
						)
					} else {
						// Something else happened
						setRegistrationError(
							'An error occurred during registration. Please try again.',
						)
					}
				})
				.finally(() => {
					setIsLoading(false)
				})
		} catch (error) {
			console.error('Registration error:', error)
			setRegistrationError('An unexpected error occurred. Please try again.')
			setIsLoading(false)
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
						placeholder="Your Full Name"
						{...register('userName', {
							required: 'Full name is required',
						})}
						className="w-full px-4 py-2 border rounded leading-tight focus:outline-none focus:border-primary"
					/>
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
						className={`w-full px-4 py-2 font-bold text-white bg-primary hover:cursor-pointer hover:bg-secondary rounded focus:outline-none focus:shadow-outline ${
							isLoading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						value={isLoading ? 'Registering...' : 'Register'}
						disabled={isLoading}
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
