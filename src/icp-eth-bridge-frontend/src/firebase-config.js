import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyD7aKk923ZavyHlGZXR9aHUvCQti92P5i0",
    authDomain: "connectversev1.firebaseapp.com",
    projectId: "connectversev1",
    storageBucket: "connectversev1.firebasestorage.app",
    messagingSenderId: "664225251835",
    appId: "1:664225251835:web:dbf794a73d42ca8a354b5e",
    measurementId: "G-D4M7YSW6QF"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      console.log(profilePic);
      
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
      window.location.href="/home"
    })
    .catch((error) => {
      console.log(error);
    });
};

export const storage = getStorage(app);