import { db, auth } from "../util/firebase";

const isEmpty = string => {
	if (string.trim() === "") return true;
	return false;
};

const isEmail = email => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;
	return false;
};

//validate signup
export const validateSignUpUser = userData => {
	let errors = {};

	if (isEmpty(userData.email)) errors.email = "Must not be empty";
	else if (!isEmail(userData.email))
		errors.email = "Must be a Valid email address";

	if (isEmpty(userData.password)) errors.password = "Must not be empty";
	if (userData.password !== userData.confirmPassword)
		errors.confirmPassword = "Must be mutch password";

	if (isEmpty(userData.handle)) errors.handle = "Must not be empty";

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

// validate Login
export const validateLoginUser = userData => {
	let errors = {};

	if (isEmpty(userData.email)) errors.email = "Must not be empty";
	else if (!isEmail(userData.email)) errors.email = "Must be a valid email";

	if (isEmpty(userData.password)) errors.password = "Must not be empty";

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false,
	};
};

// validate Add User Details
export const validateAddUserDetails = userData => {
	const userDetailsUpdated = {};

	if (!isEmpty(userData.bio.trim())) userDetailsUpdated.bio = userData.bio;

	if (!isEmpty(userData.websiteUrl.trim())) {
		if (userData.websiteUrl.trim().substring(0, 4) !== "http") {
			userDetailsUpdated.websiteUrl = `http://${userData.websiteUrl.trim()}`;
		} else userDetailsUpdated.websiteUrl = userData.websiteUrl.trim();
	}

	if (!isEmpty(userData.location.trim()))
		userDetailsUpdated.location = userData.location;

	return userDetailsUpdated;
};

// Current User
export const getCurrentUser = async () => {
	let currentUserCredentials;
	const currentUser = auth.currentUser;

	if (!currentUser)
		return {
			valid: false,
			currentUserCredentials: null,
		};

	await db
		.collection("users")
		.where("userId", "==", currentUser.uid)
		.limit(1)
		.get()
		.then(docsUsers => {
			currentUserCredentials = docsUsers.docs[0].data();
		})
		.catch(err => {
			console.log(err);
		});

	return {
		valid: true,
		currentUserCredentials,
	};
};
