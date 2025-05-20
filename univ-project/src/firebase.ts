// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyArN-Tbs8y2C_8p-UUOI91l4EjFyIx42jw",
  authDomain: "univ-project-15f72.firebaseapp.com",
  projectId: "univ-project-15f72",
  storageBucket: "univ-project-15f72.appspot.com", // Fixed storage bucket
  messagingSenderId: "143429697120",
  appId: "1:143429697120:web:fdf12ebf59fec738a24d05",
  measurementId: "G-LWMTT03HY3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Configure providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Remove the repo scope and add proper configuration
githubProvider.setCustomParameters({
  allow_signup: 'true'
});

export { app, analytics, db, auth, googleProvider, githubProvider };