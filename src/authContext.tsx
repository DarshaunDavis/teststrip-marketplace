// src/authContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";

import { ref, set, get, child } from "firebase/database";
import { auth, rtdb } from "./firebase";
import type { UserRole } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  role: UserRole | null;

  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

// Small helper to validate role coming from DB
function normalizeRole(value: any): UserRole {
  const allowed: UserRole[] = [
    "seller",
    "buyer",
    "wholesaler",
    "admin",
    "moderator",
  ];
  if (allowed.includes(value)) return value;
  return "seller"; // default fallback
}

async function fetchUserRole(uid: string): Promise<UserRole> {
  const snap = await get(child(ref(rtdb), `users/${uid}/role`));
  if (snap.exists()) {
    return normalizeRole(snap.val());
  }
  return "seller";
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setUser(fbUser);

      try {
        const r = await fetchUserRole(fbUser.uid);
        setRole(r);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setRole("seller");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // Email/password sign-in
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const r = await fetchUserRole(cred.user.uid);
      setUser(cred.user);
      setRole(r);
    } finally {
      setLoading(false);
    }
  };

  // Email/password register
  const registerWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      const uid = cred.user.uid;
      const defaultRole: UserRole = "seller"; // 👈 new users start as sellers

      await set(ref(rtdb, `users/${uid}`), {
        email,
        role: defaultRole,
        createdAt: Date.now(),
      });

      setUser(cred.user);
      setRole(defaultRole);
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const uid = cred.user.uid;

      // Check if user doc exists; if not, create with default role
      const snap = await get(child(ref(rtdb), `users/${uid}`));

      let r: UserRole;
      if (snap.exists()) {
        const data = snap.val();
        r = normalizeRole(data.role);
      } else {
        r = "seller";
        await set(ref(rtdb, `users/${uid}`), {
          email: cred.user.email ?? "",
          role: r,
          createdAt: Date.now(),
        });
      }

      setUser(cred.user);
      setRole(r);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
    setRole(null);
  };

  const value: AuthContextValue = {
    user,
    loading,
    role,
    signInWithEmail,
    registerWithEmail,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
