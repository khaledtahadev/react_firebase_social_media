import {
	POST_SCREAM,
	DELETE_SCREAM,
	GET_ALL_SCREAM_FIRST,
	GET_ALL_SCREAM_PAGNATION,
	GET_ONE_SCREAM,
	LOADING_SCREAMS,
	LOADING_UI,
	STOP_LOADING_UI,
	POST_COMMENT,
	DELETE_COMMENT,
	LIKE_SCREAM,
	UNLIKE_SCREAM,
	STOP_DISPATCH,
	LOADING_COMMENT,
	STOP_LOADING_COMMENT,
} from "../types";
import {
	postOneScream,
	deleteOneScream,
	getAllScreams,
	getOneScream,
	setCommentOnScream,
	deleteCommentOnScream,
	setLikeOnScream,
	setUnLikeScream,
} from "../../handlers/screams";
import { getUserDetails } from "../../handlers/users";

// post one scream
export const postScream = data => async dispatch => {
	try {
		dispatch({ type: LOADING_UI });
		const newPost = await postOneScream(data);
		dispatch({ type: POST_SCREAM, payload: newPost });
		dispatch({ type: STOP_LOADING_UI });
	} catch (error) {
		console.log(error);
		dispatch({ type: STOP_LOADING_UI });
	}
};

// deletePost
export const deleteScream = screamId => async dispatch => {
	try {
		await deleteOneScream(screamId);
		dispatch({ type: DELETE_SCREAM, payload: screamId });
	} catch (error) {
		console.log(error);
	}
};

// get all screams
export const allScreams = () => async dispatch => {
	dispatch({ type: LOADING_SCREAMS });
	const screams = await getAllScreams();
	dispatch({ type: GET_ALL_SCREAM_FIRST, payload: screams });
	console.log(screams);
};

// get by pagination screams
export const allScreamsPagination = latestDoc => async dispatch => {
	dispatch({ type: LOADING_UI });
	const screams = await getAllScreams(latestDoc);
	dispatch({ type: GET_ALL_SCREAM_PAGNATION, payload: screams });
	dispatch({ type: STOP_LOADING_UI });

	if (!screams.length) {
		dispatch({ type: STOP_DISPATCH });
	}
};

//get all scream to specific user
export const specificUserData = userHandle => async dispatch => {
	try {
		dispatch({ type: LOADING_SCREAMS });
		const userData = await getUserDetails(userHandle);
		dispatch({ type: GET_ALL_SCREAM_FIRST, payload: userData.screams });
	} catch (error) {
		dispatch({ type: GET_ALL_SCREAM_FIRST, payload: null });
	}
};

// get one scream
export const oneScream = screamId => async dispatch => {
	dispatch({ type: LOADING_UI });
	const scream = await getOneScream(screamId);
	dispatch({ type: GET_ONE_SCREAM, payload: scream });
	dispatch({ type: STOP_LOADING_UI });
};

// add comments
export const addComment = (commentBody, screamId) => async dispatch => {
	try {
		dispatch({ type: LOADING_COMMENT });
		const newComment = await setCommentOnScream(commentBody, screamId);
		dispatch({ type: POST_COMMENT, payload: newComment });
		dispatch({ type: STOP_LOADING_COMMENT });
	} catch (error) {
		console.log(error);
		dispatch({ type: STOP_LOADING_COMMENT });
	}
};

// delete comment
export const deleteComment = (screamId, commentId) => async dispatch => {
	try {
		dispatch({ type: LOADING_COMMENT });
		await deleteCommentOnScream(screamId, commentId);
		dispatch({ type: DELETE_COMMENT, payload: commentId });
		dispatch({ type: STOP_LOADING_COMMENT });
	} catch (error) {
		console.log(error);
		dispatch({ type: STOP_LOADING_COMMENT });
	}
};

// like scream
export const likeScream = screamId => async dispatch => {
	try {
		const screamLike = await setLikeOnScream(screamId);
		dispatch({ type: LIKE_SCREAM, payload: screamLike });
	} catch (error) {
		console.log(error);
	}
};

// unlike scream
export const unLikeScream = screamId => async dispatch => {
	try {
		const screamUnLike = await setUnLikeScream(screamId);
		dispatch({ type: UNLIKE_SCREAM, payload: screamUnLike });
	} catch (error) {
		console.log(error);
	}
};
