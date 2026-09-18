import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

// Firebase configuration from environment variables with safe defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoBetterEveryDayKey12345',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'better-every-day-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'better-every-day-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'better-every-day-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DEMO12345'
};

// Check if live API key is configured
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== 'AIzaSyDemoBetterEveryDayKey12345'
);

// Initialize Firebase App instance (singleton)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics conditionally
export let analytics = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then(supported => {
    if (supported && isFirebaseConfigured) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

/**
 * Sign in with Google (Popup with graceful redirect fallback & demo fallback)
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured) {
    // Graceful Demo / Local simulation when API keys are not yet configured in .env
    const demoUser = {
      uid: 'demo_google_user_' + Date.now(),
      displayName: 'Rohini Moodley',
      email: 'rohini.moodley@example.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemo: true
    };
    return demoUser;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn('Popup sign in failed, trying redirect or returning error:', error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        throw redirectErr;
      }
    } else {
      throw error;
    }
  }
}

/**
 * Sign out
 */
export async function logoutUser() {
  if (!isFirebaseConfigured) {
    return true;
  }
  return await firebaseSignOut(auth);
}

/**
 * Listen to auth state changes
 */
export function onAuthChanged(callback) {
  if (!isFirebaseConfigured) {
    // Check local storage for simulated login
    const savedDemo = localStorage.getItem('bed_demo_auth_user');
    if (savedDemo) {
      try {
        callback(JSON.parse(savedDemo));
      } catch (e) {
        callback(null);
      }
    } else {
      callback(null);
    }
    return () => {};
  }
  return firebaseOnAuthStateChanged(auth, callback);
}
