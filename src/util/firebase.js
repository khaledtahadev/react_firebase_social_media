import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyC7g3hyfTOV3Qt1_y0FLcDpJRcd6Nu7hCs",
	authDomain: "socialproject2-59600.firebaseapp.com",
	projectId: "socialproject2-59600",
	storageBucket: "socialproject2-59600.appspot.com",
	messagingSenderId: "440536491946",
	appId: "1:440536491946:web:416c2276c898f442ed2dd3",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
