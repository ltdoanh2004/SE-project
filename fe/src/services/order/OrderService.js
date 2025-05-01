import { CookieService } from '../../utils/CookieService.js'
import request from '../../utils/request.js'

const token = CookieService.getCookie('token')
export class OrderService {
	static creatOrder = (data) => {
		return request({
			url: 'order',
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			data: data,
		})
	}
	static payByMomo = (orderId) => {
		return request({
			url: `/payments/momo/${orderId}/transaction`,
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
	}
	static payByZalo = (orderId) => {
		return request({
			url: `/payments/zaloPay/${orderId}/transaction`,
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
	}
	static getOrderList = () => {
		return request({
			url: '/order/customer',
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
	}
	static getOrderById = (orderId) => {
		return request({
			url: `/order/${orderId}/customer`,
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
	}
}
