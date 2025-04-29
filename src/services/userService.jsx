import { https } from './configURL'

export const userServ = {
	postLogin: async (data) => {
		try {
			const response = await https.get('/user')
			const users = response.data

			const user = users.find(
				(u) => u.email === data.email && u.password === data.password,
			)
			if (user) {
				return { data: user }
			} else {
				throw new Error('User not found or incorrect credentials')
			}
		} catch (error) {
			console.error('Error during login:', error)
			throw error
		}
	},

	postRegister: async (data) => {
		try {
			// Ensure data only contains email and password
			const payload = {
				email: data.email,
				password: data.password,
			}

			const registerResponse = await https.post('/user', payload)
			return registerResponse
		} catch (error) {
			console.error('Error during registration:', error)
			throw error
		}
	},
}
