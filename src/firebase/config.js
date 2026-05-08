// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAJhXbr4OBLGTivbys7ycQ8bCyMOOmtpa8",
  authDomain: "library-management-syste-38437.firebaseapp.com",
  databaseURL: "https://library-management-syste-38437-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "library-management-syste-38437",
  storageBucket: "library-management-syste-38437.firebasestorage.app",
  messagingSenderId: "622800434571",
  appId: "1:622800434571:web:1f5db367bc65d73f556b8e",
  measurementId: "G-7QGN5MHXPK"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
