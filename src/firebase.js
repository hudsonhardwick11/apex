import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxEGs8m0So9jleLlk7pH79a0qE51dn2iE",
  authDomain: "apex-47c37.firebaseapp.com",
  projectId: "apex-47c37",
  storageBucket: "apex-47c37.firebasestorage.app",
  messagingSenderId: "773569381439",
  appId: "1:773569381439:web:0c4cc14c3a3af6b4e8e48a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);