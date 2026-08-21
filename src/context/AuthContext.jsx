// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged, signOut,
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext(null);


const ADMIN_EMAIL = 'kamranalam4555@gmail.com'; 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signupWithEmail = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result;
  };

  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);


  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{
      user, loading, isAdmin,
      loginWithGoogle, loginWithEmail, signupWithEmail, logout, resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { ADMIN_EMAIL };
