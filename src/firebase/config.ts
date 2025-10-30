// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkBUrt-28Mq0ggKJh7JAX7qTKzi9dRtf4",
  authDomain: "finai-rv8zz.firebaseapp.com",
  databaseURL: "https://finai-rv8zz-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "finai-rv8zz",
  storageBucket: "finai-rv8zz.firebasestorage.app",
  messagingSenderId: "296876375538",
  appId: "1:296876375538:web:d20a31ed46316d6cf5ff6b",
  measurementId: "G-388J9KDVWY"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

export { app };
