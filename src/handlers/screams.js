import { db } from "../util/firebase";
import { getCurrentUser } from "../util/validators";

// const db = firestore();

// Get All Screams
export const getAllScreams = async latestDoc => {
	let allScreams = [];

	await db
		.collection("screams")
		.orderBy("createdAt")
		.startAfter(latestDoc || 0)
		.limit(3)
		.get()
		.then(docsScreams => {
			docsScreams.forEach(docScream => {
				allScreams.push({ ...docScream.data(), screamId: docScream.id });
			});
		})
		.catch(err => console.log(err));

	return allScreams;
};

// Get One Scream
export const getOneScream = async screamId => {
	let screamData = {};

	await db
		.doc(`screams/${screamId}`)
		.get()
		.then(docScream => {
			if (!docScream.exists) return console.log("Scream does not exist");
			screamData = docScream.data();
			screamData.screamId = docScream.id;

			//comment Scream
			return db
				.collection("comments")
				.orderBy("createdAt", "desc")
				.where("screamId", "==", docScream.id)
				.get();
		})
		.then(docsComments => {
			screamData.comments = [];

			docsComments.forEach(docComment => {
				screamData.comments.push({
					...docComment.data(),
					commentId: docComment.id,
				});
			});
		})
		.catch(err => {
			console.log(err);
		});

	return screamData;
};

// Post One Scream
export const postOneScream = async screamBody => {
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) return console.log("user is not logged in");

	if (screamBody.trim() === "") throw new Error("Must not be empty");

	const newScreams = {
		body: screamBody,
		userHandle: currentUserCredentials.userHandle,
		userAvatarURL: currentUserCredentials.avatarURL,
		commentCount: 0,
		likeCount: 0,
		createdAt: new Date().toISOString(),
	};

	await db
		.collection("screams")
		.add(newScreams)
		.then(doc => {
			newScreams.screamId = doc.id;
		})
		.catch(err => {
			console.log(err);
		});

	return newScreams;
};

// Delete One Scream
export const deleteOneScream = async screamId => {
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) throw new Error("user is not logged in");

	const docScreamRef = await db.doc(`screams/${screamId}`).get();
	if (!docScreamRef.exists) throw new Error("scream not found");

	const docScream = docScreamRef.data();

	if (docScream.userHandle !== currentUserCredentials.userHandle)
		throw new Error("Unauthorized");

	docScreamRef.ref.delete().then(d => {
		console.log("Scream SuccessFully Deleted");
	});

	// Also Delete All Related With Scream
	const batch = db.batch();

	// Deleted Likes Related With This Scream
	(
		await db.collection("likes").where("screamId", "==", screamId).get()
	).forEach(doc => batch.delete(db.doc(`likes/${doc.id}`)));

	// Deleted comments Related With This Scream
	(
		await db.collection("comments").where("screamId", "==", screamId).get()
	).forEach(doc => batch.delete(db.doc(`comments/${doc.id}`)));

	// Deleted notifications Related With This Scream
	(
		await db.collection("notifications").where("screamId", "==", screamId).get()
	).forEach(doc => batch.delete(db.doc(`notifications/${doc.id}`)));

	batch.commit();
};

// Set Comment On Scream & its Notification
export const setCommentOnScream = async (commentBody, screamId) => {
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) throw new Error("user is not logged in");

	if (commentBody.trim() === "") throw new Error("comment body is empty");

	const docScreamRef = await db.doc(`screams/${screamId}`).get();
	if (!docScreamRef.exists) throw new Error("scream not found");
	const screamData = docScreamRef.data();
	screamData.screamId = docScreamRef.id;

	const newComment = {
		body: commentBody,
		screamId,
		userHandle: currentUserCredentials.userHandle,
		avatarURL: currentUserCredentials.avatarURL,
		createdAt: new Date().toISOString(),
	};

	const comment = await db.collection("comments").add(newComment);
	newComment.commentId = comment.id;

	docScreamRef.ref.update({
		commentCount: screamData.commentCount + 1,
	});

	// Add Notification
	try {
		if (screamData.userHandle !== currentUserCredentials.userHandle) {
			await db.doc(`notifications/${newComment.commentId}`).set({
				recipient: screamData.userHandle,
				sender: currentUserCredentials.userHandle,
				read: false,
				screamId: screamData.screamId,
				type: "comment",
				createdAt: new Date().toISOString(),
			});
		}
	} catch (error) {
		console.log(error);
	}

	return newComment;
};

// Delete Comment on Scream
export const deleteCommentOnScream = async (screamId, commentId) => {
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) throw new Error("user is not logged in");

	const docScreamRef = await db.doc(`screams/${screamId}`).get();
	if (!docScreamRef.exists) throw new Error("scream not found");

	const docCommentRef = await db.doc(`comments/${commentId}`).get();
	if (!docCommentRef.exists) throw new Error("comments not found");

	if (docCommentRef.data().userHandle !== currentUserCredentials.userHandle)
		throw new Error("User Unauthorized");

	await docCommentRef.ref.delete();

	await docScreamRef.ref
		.update({
			commentCount: docScreamRef.data().commentCount - 1,
		})
		.then(() => {
			console.log("Deleted comment SuccessFully");
		});

	// Delete Notification
	await db
		.doc(`notifications/${docCommentRef.id}`)
		.delete()
		.then(() => console.log("SuccessFully Deleted Comment"))
		.catch(err => console.log(err));
};

// Set Like On Scream
export const setLikeOnScream = async screamId => {
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) throw new Error("user is not logged in");

	const docScreamRef = await db.doc(`screams/${screamId}`).get();
	if (!docScreamRef.exists) throw new Error("scream not found");
	const screamData = docScreamRef.data();
	screamData.screamId = docScreamRef.id;

	const likeDocument = await db
		.collection("likes")
		.where("userHandle", "==", currentUserCredentials.userHandle)
		.where("screamId", "==", screamId)
		.limit(1)
		.get();

	if (!likeDocument.empty) throw new Error("liked before");

	const like = await db.collection("likes").add({
		screamId: docScreamRef.id,
		userHandle: currentUserCredentials.userHandle,
	});

	screamData.likeCount++;
	docScreamRef.ref
		.update({ likeCount: screamData.likeCount })
		.then(() => console.log("Like SuccessFully added"));

	// Add Notification
	try {
		if (screamData.userHandle !== currentUserCredentials.userHandle) {
			await db.doc(`notifications/${like.id}`).set({
				recipient: screamData.userHandle,
				sender: currentUserCredentials.userHandle,
				read: false,
				screamId: screamData.screamId,
				type: "like",
				createdAt: new Date().toISOString(),
			});
		}
	} catch (error) {
		console.log(error);
	}

	return screamData;
};

// Set Unlike On Scream
export const setUnLikeScream = async screamId => {
	const { valid, currentUserCredentials } = await getCurrentUser();
	if (!valid) return console.log("user is not logged in");

	const docScreamRef = await db.doc(`screams/${screamId}`).get();
	if (!docScreamRef.exists) throw new Error("scream not found");
	const screamData = docScreamRef.data();
	screamData.screamId = docScreamRef.id;

	const unLike = await db
		.collection("likes")
		.where("screamId", "==", screamId)
		.where("userHandle", "==", currentUserCredentials.userHandle)
		.limit(1)
		.get();

	if (unLike.empty) throw new Error("screma is already unliked");
	const unLikeId = unLike.docs[0].id;
	unLike.docs[0].ref.delete();

	screamData.likeCount--;
	docScreamRef.ref.update({ likeCount: screamData.likeCount }).then(() => {
		console.log("Unliked SuccessFully");
	});

	// Delete Notification
	await db
		.doc(`notifications/${unLikeId}`)
		.delete()
		.then(() => console.log("SuccessFully Delete notification"))
		.catch(err => console.log(err));

	return screamData;
};

//Notification When Like and UnLike On Scremas
export const NotificationWhenLikeAndUnLikeScremas = () => {
	db.collection("likes").onSnapshot({}, snapshot => {
		snapshot.snapshot.docChanges().forEach(async change => {
			//* when added docLike
			if (change.type === "added") {
				try {
					const docScreamLikedRef = await db
						.doc(`screams/${change.doc.data().screamId}`)
						.get();

					if (
						docScreamLikedRef.exists &&
						docScreamLikedRef.userHandle !== change.doc.get().userHandle
					) {
						await db.doc(`notifications/${change.doc.id}`).set({
							recipient: docScreamLikedRef.data().userHandle,
							sender: change.doc.data().userHandle,
							read: false,
							screamId: docScreamLikedRef.id,
							type: "like ",
							createdAt: new Date().toISOString(),
						});
					}
				} catch (error) {
					console.log(error);
				}
			}
			//* when remove docLike
			if (change.type === "removed") {
				await db
					.doc(`notifications/${change.doc.id}`)
					.delete()
					.then(() => console.log("SuccessFully Delete notification"))
					.catch(err => console.log(err));
			}
		});
	});
};

// Notification When Add and Delete Comment On Screams
export const NotificationWhenAddedAndDeletedCommentOnScremas = () => {
	db.collection("comments").onSnapshot(snapshot => {
		snapshot.docChanges().forEach(async change => {
			//* When Added DocComment
			if (change.type === "added") {
				try {
					const docScreamComment = await db
						.doc(`screams/${change.doc.data().screamId}`)
						.get();

					if (
						docScreamComment.exists &&
						docScreamComment.data().userHandle !== change.doc.data().userHandle
					) {
						await db.doc(`notifications/${change.doc.id}`).set({
							recipient: docScreamComment.data().userHandle,
							sender: change.doc.data().userHandle,
							read: false,
							screamId: docScreamComment.id,
							type: "comment",
							createdAt: new Date().toISOString(),
						});
					}
				} catch (error) {
					console.log(error);
				}
			}
			//* When Removed DocComment
			if (change.type === "removed") {
				await db
					.doc(`notifications/${change.doc.id}`)
					.delete()
					.then(() => console.log("SuccessFully Deleted Comment"))
					.catch(err => console.log(err));
			}
		});
	});
};

// Listener When Delete Scream Id Fro Remoe
