import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/actions/actionUser'; // Adjust the import path as needed
import Transition from '../../utils/Transition'; // Adjust the import path as needed
import Logo from '../../assets/logo.png'; // Adjust the import path as needed


export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
	const navigate = useNavigate(); // Initialize useNavigate
	const errorMessage = useSelector((state) => state.user.errorMessage); // Access error message from Redux state

    const onSubmit = async data => {
        try {
            await dispatch(loginUser(data.email, data.password));
			navigate('/');
        } catch (error) {
			console.error(error);
        }
    };

    return (
        <Transition className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md p-8 space-y-3 rounded shadow-md bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center justify-center space-x-4">
                        <img src={Logo} alt="Logo" className="cursor-pointer h-9 w-9 md:h-10 md:w-10" />
                        <a className="uppercase text-xl text-gray-900">Jewelry Store</a>
                    </div>
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
                    <input
                        placeholder="Email"
                        {...register('email', { required: true })}
                        className="w-full px-4 py-2 border rounded leading-tight focus:outline-none focus:border-primary"
                    />
                    {errors.email && <span className="text-red-500">This field is required</span>}
                    <input
                        placeholder="Password"
                        type="password"
                        {...register('password', { required: true })}
                        className="w-full px-4 py-2 border rounded leading-tight focus:outline-none focus:border-primary"
                    />
                    {errors.password && <span className="text-red-500">This field is required</span>}
                    <input
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-primary rounded hover:bg-primary-dark focus:outline-none focus:shadow-outline"
                        value="Login"
                    />
                </form>
				{errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
                <p className="text-center text-gray-600">
                    Do not have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </Transition>
    );
}
