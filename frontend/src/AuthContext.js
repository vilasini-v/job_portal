import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword } from './firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user); // Set user correctly after Google login
      setCurrentUser(user); // Optionally set currentUser too
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  // Sign-in function
  const handleSignIn = async (email, password) => {
    try {
      const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user from userCredential
      setUser(user); // Update the user state
      setCurrentUser(user); // Also update currentUser
      return userCredential;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error; // Optionally re-throw to handle in UI
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setUser(user);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    currentUser,
    loginWithGoogle,
    logout,
    handleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
