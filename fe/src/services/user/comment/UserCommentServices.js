import request from "../../../utils/request"
import { CookieService } from "../../../utils/CookieService"

const token = CookieService.getCookie("token")
export class UserCommentService {
	static postComment = (productId, { content, stars }) => {
		return request({
			url: `customer/${productId}/reviews`,
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			data: { content, stars },
		})
	}
	static getComments = (productId) => {
		return request({
			url: `product/${productId}/reviews`,
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
	}
}
