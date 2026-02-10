import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile (role, display name etc.) from Firestore
  const fetchProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return null;
    }
    try {
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const profile = snap.data();
        setUserProfile(profile);
        return profile;
      } else {
        // First time sign-in — create profile doc
        const newProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "Citizen",
          photoURL: firebaseUser.photoURL || "",
          role: "citizen", // default role; admins set via Firestore console
          createdAt: new Date().toISOString(),
        };
        await setDoc(ref, newProfile);
        setUserProfile(newProfile);
        return newProfile;
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setUserProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await fetchProfile(result.user);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === "admin";
  const isAuthenticated = !!user;

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    isAuthenticated,
    loginGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
