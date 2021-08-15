import {
	SET_ERROR,
	CLEAR_ERROR,
	LOADING_UI,
	STOP_LOADING_UI,
	OPEN_DISPATCH,
	STOP_DISPATCH,
	LOADING_COMMENT,
	STOP_LOADING_COMMENT,
} from "../types";

const initState = {
	loading: false,
	error: null,
	loadingComment: false,
	stopDispatch: false,
};

const uiReducer = (state = initState, action) => {
	switch (action.type) {
		case OPEN_DISPATCH:
			return {
				...state,
				stopDispatch: false,
			};

		case STOP_DISPATCH:
			return {
				...state,
				stopDispatch: true,
			};

		case LOADING_COMMENT:
			return {
				...state,
				loadingComment: true,
			};

		case STOP_LOADING_COMMENT:
			return {
				...state,
				loadingComment: false,
			};

		case LOADING_UI:
			return {
				...state,
				loading: true,
			};

		case STOP_LOADING_UI:
			return {
				...state,
				loading: false,
			};

		case SET_ERROR:
			return {
				loading: false,
				error: action.payload,
			};

		case CLEAR_ERROR:
			return initState;

		default:
			return state;
	}
};

export default uiReducer;
