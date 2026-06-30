/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// Replace with your Firebase configurations
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if config is present
let auth = null;
const hasConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (hasConfig) {
  try {
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
    } else {
      auth = getAuth();
    }
  } catch (err) {
    console.error("Firebase client initialization error:", err);
  }
}

interface UserType {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithMock: () => void;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(!auth);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not initialized. Running in Mock Auth Mode.");
      // In mock mode, we trigger login if we want or leave as null until they click login.
      // Let's check localStorage for a saved mock user session
      const savedUser = localStorage.getItem("deadlinepilot_mock_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setToken("mock-token-123");
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "Deadline Pilot User",
          photoURL: firebaseUser.photoURL || ""
        });
        setIsMock(false);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    if (!auth) {
      // Mock Google Login
      const mockSession = {
        uid: "mock_user_123",
        email: "pilot@deadline.ai",
        displayName: "Vibe Pilot",
        photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=VibePilot"
      };
      setUser(mockSession);
      setToken("mock-token-123");
      localStorage.setItem("deadlinepilot_mock_user", JSON.stringify(mockSession));
      setIsMock(true);
      setLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Auth error:", error);
      setLoading(false);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    if (!auth) {
      // Mock Email Login
      const mockSession = {
        uid: "mock_user_123",
        email: email,
        displayName: email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      };
      setUser(mockSession);
      setToken("mock-token-123");
      localStorage.setItem("deadlinepilot_mock_user", JSON.stringify(mockSession));
      setIsMock(true);
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    if (!auth) {
      // Mock Signup
      const mockSession = {
        uid: "mock_user_123",
        email: email,
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
      };
      setUser(mockSession);
      setToken("mock-token-123");
      localStorage.setItem("deadlinepilot_mock_user", JSON.stringify(mockSession));
      setIsMock(true);
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      // Wait for auth state change to update profile name
      if (auth.currentUser) {
        // Simple mock display name set could trigger profile updates, but is checked during token verify
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithMock = () => {
    setLoading(true);
    const mockSession = {
      uid: "mock_user_123",
      email: "pilot@deadline.ai",
      displayName: "Vibe Pilot",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=VibePilot"
    };
    setUser(mockSession);
    setToken("mock-token-123");
    localStorage.setItem("deadlinepilot_mock_user", JSON.stringify(mockSession));
    setIsMock(true);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    if (!auth) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("deadlinepilot_mock_user");
      setLoading(false);
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, logout, loginWithMock, isMock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDtncobAnQdeur1XPPFPXtO_rmqyBuDhzk",
//   authDomain: "deadlinepilot-5f7b1.firebaseapp.com",
//   projectId: "deadlinepilot-5f7b1",
//   storageBucket: "deadlinepilot-5f7b1.firebasestorage.app",
//   messagingSenderId: "796548117704",
//   appId: "1:796548117704:web:40d5ddac61c8864711e1fd",
//   measurementId: "G-5HZHXTNHHH"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);