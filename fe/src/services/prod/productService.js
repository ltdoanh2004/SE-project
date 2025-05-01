import { body } from 'framer-motion/client'
import request from '../../utils/request.js'

export class ProductService {
	static getAllProductList = () => {
		return request({
			url: 'product/get-Jewelry',
			method: 'get',
			Headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
	}
	static getFilteredProductList = (data) => {
		return request({
			url: 'product/get-Jewelry',
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			data: data,
		})
	}

	// static register = (data) => {
	//   return request({
	//     url: '/api/v1/user/register',
	//     method: 'post',
	//     Headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
	//     data: data
	//   });
	// };
}
