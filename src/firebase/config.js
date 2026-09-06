import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDsD9b13McteMbYSope41g-7ocRU29f4ig",
  authDomain: "concourspro-app.firebaseapp.com",
  projectId: "concourspro-app",
  storageBucket: "concourspro-app.firebasestorage.app",
  messagingSenderId: "595189272188",
  appId: "1:595189272188:web:0b174ff6cfe8f5475e43f9"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
