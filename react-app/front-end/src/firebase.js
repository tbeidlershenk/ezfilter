// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwngLrYNl07QlMnh-ubpl8uNq0KXhJ-OQ",
  authDomain: "ezfilter-ece00.firebaseapp.com",
  projectId: "ezfilter-ece00",
  storageBucket: "ezfilter-ece00.appspot.com",
  messagingSenderId: "287520143373",
  appId: "1:287520143373:web:71f6a0105d20f55ed8bd44",
  measurementId: "G-MS7TXDEHLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default getFirestore(app);