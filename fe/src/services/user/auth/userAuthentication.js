import { CookieService } from '../../../utils/CookieService.js';
import request from '../../../utils/request.js';

const token = CookieService.getCookie('token')
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
	static changePassword = ({oldPassword, newPassword}) => {
		return request({
			url: 'users/change-password',
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			data: { oldPassword, newPassword },
		})
	}
}
