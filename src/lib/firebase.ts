import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace with your Firebase project's configuration.
// You can find this in your Firebase project settings under "Web apps".
const firebaseConfig = {
  apiKey: "AIzaSyBNLqTkyR3tNKMHhs6G0P_giORHQpUA9WI",
  authDomain: "echosphere-9mbl1.firebaseapp.com",
  projectId: "echosphere-9mbl1",
  storageBucket: "echosphere-9mbl1.appspot.com",
  messagingSenderId: "631363835926",
  appId: "1:631363835926:web:71e0e7a16e6ab4a69ebd37",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
