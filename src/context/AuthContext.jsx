import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginWithGoogle, 
  logoutUser, 
  onAuthChanged, 
  isFirebaseConfigured 
} from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      setIsAuthLoading(true);
      const user = await loginWithGoogle();
      setCurrentUser(user);
      if (user?.isDemo) {
        localStorage.setItem('bed_demo_auth_user', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setAuthError(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      setIsAuthLoading(true);
      await logoutUser();
      localStorage.removeItem('bed_demo_auth_user');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout Error:', error);
      setAuthError(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthLoading,
      authError,
      isConfigured: isFirebaseConfigured,
      signInWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
