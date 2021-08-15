import {
	LOADING_SCREAMS,
	POST_SCREAM,
	DELETE_SCREAM,
	GET_ALL_SCREAM_FIRST,
	GET_ALL_SCREAM_PAGNATION,
	GET_ONE_SCREAM,
	POST_COMMENT,
	DELETE_COMMENT,
	LIKE_SCREAM,
	UNLIKE_SCREAM,
} from "../types";

const initState = {
	screams: [],
	scream: {},
	loading: false,
};

const dataReducer = (state = initState, action) => {
	switch (action.type) {
		case LOADING_SCREAMS:
			return {
				...state,
				loading: true,
			};
		case POST_SCREAM:
			return {
				...state,
				loading: false,
				screams: [action.payload, ...state.screams],
			};
		case DELETE_SCREAM: {
			const filterScream = state.screams.filter(
				scream => scream.screamId !== action.payload
			);
			return {
				...state,
				screams: [...filterScream],
			};
		}
		case GET_ALL_SCREAM_FIRST:
			return {
				...state,
				loading: false,
				screams: action.payload,
			};
		case GET_ALL_SCREAM_PAGNATION:
			return {
				...state,
				loading: false,
				screams: [...state.screams, ...action.payload],
			};
		case GET_ONE_SCREAM:
			return {
				...state,
				scream: action.payload,
			};
		case POST_COMMENT:
			const screamComment = state.screams.filter(
				scream => scream.screamId === action.payload.screamId
			);
			screamComment[0].commentCount = screamComment[0].commentCount + 1;
			const screams = state.screams.filter(
				scream => scream.screamId !== action.payload.screamId
			);
			return {
				...state,
				screams: [...screams, ...screamComment],
				scream: {
					...state.scream,
					commentCount: state.scream.commentCount + 1,
					comments: [action.payload, ...state.scream.comments],
				},
			};
		case DELETE_COMMENT:
			const filterComment = state.scream.comments.filter(
				comment => comment.commentId !== action.payload
			);
			return {
				...state,
				scream: {
					...state.scream,
					comments: [...filterComment],
				},
			};
		case LIKE_SCREAM:
		case UNLIKE_SCREAM:
			const index = state.screams.findIndex(
				scream => scream.screamId === action.payload.screamId
			);
			state.screams[index] = action.payload;
			if (state.scream.screamId === action.payload.screamId) {
				state.scream = { ...state.scream, likeCount: action.payload.likeCount };
			}
			return {
				...state,
			};

		default:
			return state;
	}
};

export default dataReducer;
