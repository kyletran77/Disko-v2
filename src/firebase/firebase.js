import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASREMENT_ID
  // apiKey: "AIzaSyBYRU9yWNQzThzh6P7MuxVyhVbCGGj_AQs",
  // authDomain: "jooby-b9791.firebaseapp.com",
  // projectId: "jooby-b9791",
  // storageBucket: "jooby-b9791.appspot.com",
  // messagingSenderId: "39659342369",
  // appId: "1:39659342369:web:103c895c5b72cc17e47160",
  // measurementId: "G-0E37YXSR5C"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
const provider = new GoogleAuthProvider();
export { app, auth, db, storage, provider, analytics };

