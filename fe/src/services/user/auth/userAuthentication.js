import request from '../../../utils/request.js';

export class UserAuthenticationService {
	static login = (data) => {
		return request({
			url: 'users/login',
			method: 'post',
			Headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			data: data,
		})
	}
	static signUp = (data) => {
		return request({
			url: 'users/register',
			method: 'post',
			Headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			data: data,
		})
	}

	static forgotPassword = (email) => {
		return request({
			url: 'users/forget-password',
			method: 'post',
			Headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			data: { email: email },
		})
	}
}
