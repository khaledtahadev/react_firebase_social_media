import {
	SET_USER,
	LOG_OUT,
	LIKE_SCREAM,
	UNLIKE_SCREAM,
	MARK_NOTIFICATIONS_READ,
} from "../types";

const initState = {
	authenticated: false,
	loading: false,
	credentials: {},
	likes: [],
	notifications: [],
};

const userReducer = (state = initState, action) => {
	switch (action.type) {
		case SET_USER:
			return {
				authenticated: true,
				loading: false,
				...action.payload,
			};

		case LOG_OUT:
			return initState;

		case LIKE_SCREAM:
			return {
				...state,
				likes: [
					...state.likes,
					{
						screamId: action.payload.screamId,
						userHandle: state.credentials.userHandle,
					},
				],
			};

		case UNLIKE_SCREAM:
			const likes = state.likes.filter(
				likes => likes.screamId !== action.payload.screamId
			);
			return {
				...state,
				likes,
			};

		case MARK_NOTIFICATIONS_READ:
			state.notifications.forEach(notification => (notification.read = true));
			return {
				...state,
			};

		default:
			return state;
	}
};

export default userReducer;
