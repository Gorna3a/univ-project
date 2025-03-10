// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBX9JSv28lopbjrEBstSCN1cEzpEa5SvBQ",
  authDomain: "myproject-e9aa8.firebaseapp.com",
  projectId: "myproject-e9aa8",
  storageBucket: "myproject-e9aa8.firebasestorage.app",
  messagingSenderId: "953948221891",
  appId: "1:953948221891:web:e4dfe5278962e4824a4d76",
  measurementId: "G-3WGYC1CJW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);