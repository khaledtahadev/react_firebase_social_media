import {
	SET_ERROR,
	CLEAR_ERROR,
	LOADING_UI,
	SET_USER,
	LOG_OUT,
	MARK_NOTIFICATIONS_READ,
} from "../types";
import {
	signUpUser,
	loginUser,
	getCurrentUserDetails,
	logout,
	addCurrentUserDetails,
	updateUserImage,
	markNotificationsRead,
} from "../../handlers/users";

export const signup = (data, history) => async dispatch => {
	dispatch({ type: CLEAR_ERROR });
	dispatch({ type: LOADING_UI });
	const userData = await signUpUser(data);
	const error = Object.keys(userData.error);

	console.log(userData.error);

	if (error.length > 0) {
		dispatch({ type: SET_ERROR, payload: userData.error });
	}

	if (error.length === 0) {
		dispatch(getUserData(history));
	}
};

export const login = (loginData, history) => async dispatch => {
	dispatch({ type: LOADING_UI });
	const userData = await loginUser(loginData);
	const error = Object.keys(userData.error);

	if (error.length > 0) {
		dispatch({ type: SET_ERROR, payload: userData.error });
	}
	if (error.length === 0) {
		dispatch(getUserData(history));
	}
};

export const signOut = history => dispatch => {
	logout();
	dispatch({ type: LOG_OUT });
	history.push("/");
	console.log("User logged out");
};

export const getUserData = history => async dispatch => {
	const currentUserDetails = await getCurrentUserDetails();
	dispatch({ type: SET_USER, payload: currentUserDetails });
	dispatch({ type: CLEAR_ERROR });
	history && history.push("/");
};

export const updateUserDetails = data => async dispatch => {
	dispatch({ type: LOADING_UI });
	await addCurrentUserDetails(data);
	await dispatch(getUserData());
};

export const updateImage = img => async dispatch => {
	dispatch({ type: LOADING_UI });
	await updateUserImage(img);
	dispatch(getUserData());
};

export const markedNotificationToRead = notificationIds => async dispatch => {
	try {
		await markNotificationsRead(notificationIds);
		dispatch({ type: MARK_NOTIFICATIONS_READ });
	} catch (error) {
		console.log(error);
	}
};
