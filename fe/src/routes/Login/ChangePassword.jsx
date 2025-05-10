import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { UserAuthenticationService } from '../../services/user/auth/userAuthentication'
import Transition from '../../utils/Transition'

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm()
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setMessage({ text: '', isError: false })
    
    try {
      const result = await UserAuthenticationService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      })
      
      setMessage({ text: 'Password changed successfully', isError: false })
      reset()
      
      // Redirect after successful password change
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error(error)
      setMessage({ 
        text: error.response?.data?.message || 'Failed to change password', 
        isError: true 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Transition className="flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Change Password
        </h1>
        
        {message.text && (
          <div className={`p-4 rounded-md ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              id="oldPassword"
              type="password"
              {...register('oldPassword', { 
                required: 'Current password is required'
              })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-primary focus:border-primary"
            />
            {errors.oldPassword && (
              <span className="text-sm text-red-500">{errors.oldPassword.message}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-primary focus:border-primary"
            />
            {errors.newPassword && (
              <span className="text-sm text-red-500">{errors.newPassword.message}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === getValues('newPassword') || 'Passwords do not match'
              })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-primary focus:border-primary"
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
        
        <div className="text-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-primary hover:underline"
          >
            Back
          </button>
        </div>
      </div>
    </Transition>
  )
}