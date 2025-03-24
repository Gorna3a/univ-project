// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArN-Tbs8y2C_8p-UUOI91l4EjFyIx42jw",
  authDomain: "univ-project-15f72.firebaseapp.com",
  projectId: "univ-project-15f72",
  storageBucket: "univ-project-15f72.firebasestorage.app",
  messagingSenderId: "143429697120",
  appId: "1:143429697120:web:fdf12ebf59fec738a24d05",
  measurementId: "G-LWMTT03HY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { app, analytics ,db ,auth, googleProvider, githubProvider};