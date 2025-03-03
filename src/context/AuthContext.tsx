import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, UserInfo } from 'firebase/auth';
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  AUTH_MODE, 
  sendVerificationEmail,
  resendVerificationEmail
} from '../firebase/firebase';

// Define the shape of our auth context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  isAdmin: boolean;
  sendEmailVerification: () => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => { throw new Error('AuthContext not initialized'); },
  register: async () => { throw new Error('AuthContext not initialized'); },
  logout: async () => { throw new Error('AuthContext not initialized'); },
  getToken: async () => { throw new Error('AuthContext not initialized'); },
  isAdmin: false,
  sendEmailVerification: async () => { throw new Error('AuthContext not initialized'); }
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Interface for the basic user data we store in localStorage
interface DevUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  idToken: string;
  isAdmin?: boolean;
}

// Force production mode
const DEV_MODE = false;
const USING_MOCK_AUTH = false;

// List of admin emails
const ADMIN_EMAILS = ['admin@example.com', 'ronadin2002@gmail.com', 'ronadin1@gmail.com'];

// Check if a user is an admin based on email
const checkIsAdmin = (email: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen for auth state changes when the component mounts
  useEffect(() => {
    console.log('Setting up Firebase auth state listener');
    
    // Use real Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
      setCurrentUser(user);
      if (user) {
        setIsAdmin(checkIsAdmin(user.email));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  // Authentication methods
  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('Logging in with production Firebase');
      const rawUser = await loginWithEmail(email, password);
      
      // For real Firebase Auth
      const firebaseUser = rawUser as User;
      setIsAdmin(checkIsAdmin(firebaseUser.email));
      
      // Set current user and return
      setCurrentUser(firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error("Login error in auth context:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<User> => {
    try {
      console.log('Registering with production Firebase');
      const rawUser = await registerWithEmail(email, password);
      
      // For real Firebase Auth
      const firebaseUser = rawUser as User;
      setIsAdmin(checkIsAdmin(firebaseUser.email));
      
      // Set current user and return
      setCurrentUser(firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error("Registration error in auth context:", error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logging out with production Firebase');
    await logoutUser();
    setCurrentUser(null);
    setIsAdmin(false);
    return true;
  };

  const getToken = async () => {
    if (!currentUser) return null;
    
    // Always use real Firebase token
    return currentUser.getIdToken();
  };

  const sendEmailVerification = async () => {
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    return resendVerificationEmail(currentUser);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    getToken,
    isAdmin,
    sendEmailVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
