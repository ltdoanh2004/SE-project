// src/redux/actions/cartActions.js

export const addToCart = (product) => {
	return {
		type: 'ADD_TO_CART',
		payload: product,
	}
}

export const removeFromCart = (productId) => {
	return {
		type: 'REMOVE_FROM_CART',
		payload: productId,
	}
}

export const updateQuantity = (productId, quantity) => {
	return {
		type: 'UPDATE_QUANTITY',
		payload: {
			id: productId,
			quantity: quantity,
		},
	}
}

export const clearCart = () => {
	return {
		type: 'CLEAR_CART',
	}
}
