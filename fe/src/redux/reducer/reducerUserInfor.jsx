export const UserInfoReducer = (state, action) => {
	const { userId, userName, userEmail } =
		action.payload
	switch (action.type) {
		case 'SET_USER_ID':
            return { ...state, userId: userId }
        case 'SET_USER_NAME':
            return { ...state, userName: userName }
        case 'SET_USER_EMAIL':
            return { ...state, userEmail: userEmail }
        case 'SET_USER_INFO':
            return {
                ...state,
                userId: userId,
                userName: userName,
                userEmail: userEmail
            }
		default:
			return state
	}
}
