// src/redux/reducer/reducerCart.js

const initialState = {
	items: [],
	loading: false,
	error: null,
}

export const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_TO_CART':
			// Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
			const existingItem = state.items.find(
				(item) => item.id === action.payload.id,
			)

			if (existingItem) {
				// Nếu sản phẩm tồn tại, tăng số lượng
				return {
					...state,
					items: state.items.map((item) =>
						item.id === action.payload.id
							? { ...item, quantity: (item.quantity || 1) + 1 }
							: item,
					),
				}
			} else {
				// Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng với số lượng là 1
				return {
					...state,
					items: [...state.items, { ...action.payload, quantity: 1 }],
				}
			}

		case 'REMOVE_FROM_CART':
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload),
			}

		case 'UPDATE_QUANTITY':
			return {
				...state,
				items: state.items.map((item) =>
					item.id === action.payload.id
						? { ...item, quantity: action.payload.quantity }
						: item,
				),
			}

		case 'CLEAR_CART':
			return {
				...state,
				items: [],
			}

		default:
			return state
	}
}
