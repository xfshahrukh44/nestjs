// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAcTrJ8Kn7l0I2HbOMgJzOskRpl3iVuEDk",
    authDomain: "texas-ashram.firebaseapp.com",
    projectId: "texas-ashram",
    storageBucket: "texas-ashram.appspot.com",
    messagingSenderId: "421890512630",
    appId: "1:421890512630:web:162abf265f0164b664fed7",
    measurementId: "G-8TK578RFWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
