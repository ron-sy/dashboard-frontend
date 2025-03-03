import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  applyActionCode,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration - using direct values for simplicity
const firebaseConfig = {
  apiKey: "AIzaSyAKLPB50C9v7thtXUOBnw3XxJTtrXOW4hc",
  authDomain: "dashboard-55056.firebaseapp.com",
  projectId: "dashboard-55056",
  storageBucket: "dashboard-55056.firebasestorage.app",
  messagingSenderId: "943483969635",
  appId: "1:943483969635:web:5abad6571284fb95519856",
  measurementId: "G-1MYYT18XZJ"
};

// Dev mode configuration
const DEV_MODE = false; // Force production mode

// Always use real Firebase auth, never mock auth
export const AUTH_MODE = 'firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

console.log("Initializing Firebase with config:", firebaseConfig);
console.log(`Running in production mode`);
console.log(`Using auth mode: ${AUTH_MODE}`);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const loginWithEmail = async (email: string, password: string) => {
  try {
    // Always use real Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string) => {
  try {
    // Always use real Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send email verification
    await sendVerificationEmail(userCredential.user);
    
    return userCredential.user;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    console.log("Verification email sent to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const resendVerificationEmail = async (user: User) => {
  if (!user) {
    throw new Error("No user is currently signed in");
  }
  return sendVerificationEmail(user);
};

export const verifyEmail = async (actionCode: string) => {
  try {
    await applyActionCode(auth, actionCode);
    return true;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Always use real Firebase Auth
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export { auth, db };
export default app;
