// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyAATFvDdsgHIuiaWv7lX_s6znOzeS6eh-Y",
  
    authDomain: "job-portal-6c938.firebaseapp.com",
  
    projectId: "job-portal-6c938",
  
    storageBucket: "job-portal-6c938.appspot.com",
  
    messagingSenderId: "592565551079",
  
    appId: "1:592565551079:web:8fca71856ba02b84234742",
  
    measurementId: "G-DXCSVZZNVB"
  
  };
  

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
// const db = getFirestore(app);
const auth = getAuth(app);


export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword };
