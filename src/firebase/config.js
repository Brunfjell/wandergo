
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCA5C65XVI5ifwlMwFpldLdKPb2-ygbwHk",
  authDomain: "wandergo-carrental.firebaseapp.com",
  projectId: "wandergo-carrental",
  storageBucket: "wandergo-carrental.firebasestorage.app",
  messagingSenderId: "623055405824",
  appId: "1:623055405824:web:f8055d3780d268cefda9e5",
  measurementId: "G-WFJTEYP5X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);