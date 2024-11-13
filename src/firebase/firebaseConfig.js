import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAgtPrtAQDoGOt77kjrHjv3-v_nmqdZcCo',
  authDomain: '<chad-chatbot-app>.firebaseapp.com',
  projectId: 'chad-chatbot-app',
  storageBucket: '<chad-chatbot-app>.appspot.com',
  messagingSenderId: '1091471550500',
  appId: '1:1091471550500:android:230238c1a3e9945c2910b1',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc };
