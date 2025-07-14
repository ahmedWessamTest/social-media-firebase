import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyASHv49l-oY49XPzSVK52soqYV1rv5OsyI",
  authDomain: "fir-67049.firebaseapp.com",
  projectId: "fir-67049",
  storageBucket: "fir-67049.firebasestorage.app",
  messagingSenderId: "145331926637",
  appId: "1:145331926637:web:a897c11097b3069aad3164",
  measurementId: "G-7MC7BZMFB3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
