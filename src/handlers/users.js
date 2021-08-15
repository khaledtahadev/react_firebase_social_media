import { db, auth, storageRef } from "../util/firebase";
import {
	validateSignUpUser,
	validateLoginUser,
	validateAddUserDetails,
	getCurrentUser,
} from "../util/validators";

//Signup User
export const signUpUser = async userData => {
	let userCredentials = {
		user: {},
		error: {},
	};

	//check if data is not valid
	const { valid, errors } = validateSignUpUser(userData);

	if (!valid) return (userCredentials.error = errors);

	const initImgUser = "initialImgUser.png";

	await db
		.doc(`/users/${userData.handle}`)
		.get()
		.then(doc => {
			if (doc.exists) {
				throw new Error("this username is already taken");
			} else {
				return auth.createUserWithEmailAndPassword(
					userData.email,
					userData.password
				);
			}
		})
		.then(data => {
			const user = data.user;

			const userCredentialsStore = {
				userId: user.uid,
				userHandle: userData.handle,
				email: userData.email,
				avatarURL: `https://firebasestorage.googleapis.com/v0/b/socialproject2-59600.appspot.com/o/${initImgUser}?alt=media`,
				createdAt: new Date().toISOString(),
			};

			userCredentials.user = userCredentialsStore;

			return db.doc(`/users/${userData.handle}`).set(userCredentialsStore);
		})
		.then(() => {
			console.log("user created");
		})
		.catch(errors => {
			console.log({ errors });
			if (errors.code === "auth/email-already-in-use")
				userCredentials.error.email = "is already in use";
			else if (errors.message === "this username is already taken") {
				userCredentials.error.handle = errors.message;
			} else {
				userCredentials.error.general =
					"Something went wrong, please try again";
			}
		});

	return userCredentials;
};

//Login User
export const loginUser = async userData => {
	let userCredentials = {
		user: {},
		error: {},
	};
	//check if data is not valid
	const { valid, errors } = validateLoginUser(userData);

	if (!valid) return (userCredentials.error = errors);

	await auth
		.signInWithEmailAndPassword(userData.email, userData.password)
		.then(data => {
			userCredentials.user = data.user;
			console.log(`user ${data.user.uid} is loggedin`);
		})
		.catch(err => {
			console.log(err);
			if (err.code === "auth/wrong-password") {
				userCredentials.error.password = err.message;
			} else if (err.code === "auth/user-not-found") {
				userCredentials.error.email = err.message;
			} else {
				userCredentials.error.general =
					"Something went wrong, please try again";
			}
		});

	return userCredentials;
};

// logout User
export const logout = () => {
	auth
		.signOut()
		.then(() => console.log("logout"))
		.catch(err => console.log(err));
};

//Get Current User Details
export const getCurrentUserDetails = async () => {
	let userDetails = {};
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) return (userDetails.error = "user is not logged in");

	userDetails.credentials = currentUserCredentials;

	// user likes
	await db
		.collection("likes")
		.where("userHandle", "==", currentUserCredentials.userHandle)
		.get()
		.then(docsLikes => {
			userDetails.likes = [];

			docsLikes.forEach(docLike => {
				userDetails.likes.push(docLike.data());
			});
		});

	// user notifications
	await db
		.collection("notifications")
		.where("recipient", "==", currentUserCredentials.userHandle)
		.orderBy("createdAt", "desc")
		.limit(10)
		.get()
		.then(docsNotifications => {
			userDetails.notifications = [];

			docsNotifications.forEach(docNotification => {
				userDetails.notifications.push({
					...docNotification.data(),
					notificationId: docNotification.id,
				});
			});
		});

	return userDetails;
};

//Add Current User Details
export const addCurrentUserDetails = async addData => {
	const dataAfterChecked = validateAddUserDetails(addData);
	if (Object.keys(dataAfterChecked).length === 0) return;

	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) return console.log("user is not logged in");

	await db
		.doc(`users/${currentUserCredentials.userHandle}`)
		.update(dataAfterChecked)
		.then(() => {
			console.log("SuccessFully updated user");
		})
		.catch(err => {
			console.log({ err });
		});
};

// get any user details by handle parameter
export const getUserDetails = async handle => {
	const userDetails = {};

	const user = await db.doc(`users/${handle}`).get();
	if (!user.exists) {
		userDetails.userCredentials = "this user not found";
	} else {
		userDetails.userCredentials = user.data();
	}

	// user screams
	const screams = await db
		.collection("screams")
		.where("userHandle", "==", handle)
		.orderBy("createdAt", "desc")
		.get();
	if (screams.empty) {
		userDetails.screams = "No Screams For This User";
	} else {
		userDetails.screams = [];
		screams.forEach(scream => {
			userDetails.screams.push({
				...scream.data(),
				screamId: scream.id,
			});
		});
	}

	return userDetails;
};

// updateCurrentUserImage
export const updateUserImage = async file => {
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) return console.log("user is not logged in");

	const imageName = file.name;
	const imageExtension = imageName.split(".")[imageName.split(".").length - 1];

	const snapshot = await storageRef
		.child(
			`/usersImagesProfile/${currentUserCredentials.userHandle}/profileImage.${imageExtension}`
		)
		.put(file);
	const avatarURL = await snapshot.ref.getDownloadURL();

	//add img to userDetails
	await db
		.doc(`users/${currentUserCredentials.userHandle}`)
		.update({ avatarURL });

	//Also Update img user in All Screams Related With This User
	const batch = db.batch();

	const docsScreams = await db
		.collection("screams")
		.where("userHandle", "==", currentUserCredentials.userHandle)
		.get();

	docsScreams.forEach(docScream => {
		batch.update(docScream.ref, { userAvatarURL: avatarURL });
	});

	return batch.commit();
};

//marked Read notifications
export const markNotificationsRead = async notificationIds => {
	const { valid } = await getCurrentUser();
	if (!valid) throw new Error("user is not logged in");

	const batch = db.batch();

	notificationIds.forEach(notificationId => {
		const refNotification = db.doc(`notifications/${notificationId}`);
		batch.update(refNotification, { read: true });
	});

	batch.commit().catch(err => {
		throw new Error(err);
	});
};

//const currentUser = auth.currentUser;
//if (!currentUser) return console.log("user is not logged in");
