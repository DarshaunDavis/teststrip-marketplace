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

import {
  ref,
  set,
  get,
  child,
  push,
  update,
  type DatabaseReference,
} from "firebase/database";

import { auth, rtdb } from "./firebase";
import type { FulfillmentPreference, UserRole } from "./types";

/**
 * Directory identity payload provided during registration.
 * This is what we use to either:
 * - create a new directory listing, or
 * - match an existing listing (by phone/email) and mark it as claimed.
 */
export type DirectoryIdentityInput = {
  listingName: string;
  phone: string;
  city: string;
  state: string;
  zip?: string;
  fulfillment: FulfillmentPreference;
};

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  role: UserRole | null;

  signInWithEmail: (email: string, password: string) => Promise<void>;

  // UPDATED: accepts directoryIdentity as 4th argument (optional)
  registerWithEmail: (
    email: string,
    password: string,
    role?: UserRole,
    directoryIdentity?: DirectoryIdentityInput
  ) => Promise<void>;

  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Small helper to validate role coming from DB
function normalizeRole(value: any): UserRole {
  const allowed: UserRole[] = ["seller", "buyer", "wholesaler", "admin", "moderator"];
  if (allowed.includes(value)) return value;
  return "seller"; // default fallback
}

function phoneDigitsOnly(v: string): string {
  return String(v ?? "").replace(/\D/g, "");
}

async function fetchUserRole(uid: string): Promise<UserRole> {
  const snap = await get(child(ref(rtdb), `users/${uid}/role`));
  if (snap.exists()) return normalizeRole(snap.val());
  return "seller";
}

async function tryUpdate(refToUpdate: DatabaseReference, patch: Record<string, any>) {
  try {
    await update(refToUpdate, patch);
    return true;
  } catch (e) {
    console.warn("[authContext] update failed (likely rules):", e);
    return false;
  }
}

/**
 * Create OR match an existing directory listing for the registering user.
 *
 * Match logic:
 *  - primary: contactPhone digits match
 *  - secondary: contactEmail match (case-insensitive)
 *
 * If match found:
 *  - try to update listing with claimedUid
 *  - if update denied by rules, we create a claim request instead
 *
 * If no match:
 *  - create a new listing (createdByAdmin=false, claimedUid=uid)
 */
async function upsertDirectoryListingForUser(params: {
  uid: string;
  email: string;
  identity: DirectoryIdentityInput;
}) {
  const { uid, email, identity } = params;

  const phoneRaw = identity.phone.trim();
  const phoneDigits = phoneDigitsOnly(phoneRaw);
  const emailTrim = email.trim().toLowerCase();

  const buyersSnap = await get(ref(rtdb, "directoryBuyers"));
  const buyersVal = buyersSnap.exists() ? (buyersSnap.val() as Record<string, any>) : null;

  let matchedId: string | null = null;

  if (buyersVal) {
    for (const [id, data] of Object.entries(buyersVal)) {
      const d: any = data ?? {};
      const existingPhone = phoneDigitsOnly(String(d.contactPhone ?? d.phone ?? ""));
      const existingEmail = String(d.contactEmail ?? d.email ?? "").trim().toLowerCase();

      if (phoneDigits && existingPhone && phoneDigits === existingPhone) {
        matchedId = id;
        break;
      }
      if (emailTrim && existingEmail && emailTrim === existingEmail) {
        matchedId = id;
        // keep looking in case phone match exists; but email match is good enough
      }
    }
  }

  const now = Date.now();

  // If we found an existing listing, try to "claim" it.
  if (matchedId) {
    const listingRef = ref(rtdb, `directoryBuyers/${matchedId}`);

    const ok = await tryUpdate(listingRef, {
      // claim fields (new)
      claimedUid: uid,
      claimedAt: now,

      // fill in missing contact fields if empty
      contactEmail: emailTrim,
      contactPhone: phoneRaw,

      // optionally patch basic info if missing in the original record
      buyerName: identity.listingName.trim(),
      city: identity.city.trim(),
      state: identity.state.trim(),
      zip: identity.zip?.trim() || "",
      fulfillment: identity.fulfillment,

      // provenance fields
      updatedAt: now,
    });

    if (ok) return;

    // If rules denied updating directoryBuyers, create a claim request instead.
    // (This is safer than failing registration.)
    const claimRef = push(ref(rtdb, "directoryClaims"));
    await set(claimRef, {
      directoryBuyerId: matchedId,
      requesterUid: uid,
      requesterEmail: emailTrim,
      requesterPhone: phoneRaw,
      requesterName: identity.listingName.trim(),
      city: identity.city.trim(),
      state: identity.state.trim(),
      zip: identity.zip?.trim() || "",
      fulfillment: identity.fulfillment,
      createdAt: now,
      status: "pending",
    });

    return;
  }

  // No match: create a new listing for the user
  const nodeRef = push(ref(rtdb, "directoryBuyers"));
  const id = nodeRef.key;

  await set(nodeRef, {
    buyerName: identity.listingName.trim(),
    city: identity.city.trim(),
    state: identity.state.trim(),
    zip: identity.zip?.trim() || "",
    fulfillment: identity.fulfillment,

    contactPhone: phoneRaw,
    contactEmail: emailTrim,

    premium: false,
    note: null,

    // provenance fields
    createdAt: now,
    createdByAdmin: false,
    createdByUid: uid,

    // claim fields
    claimedUid: uid,
    claimedAt: now,
  });

  return id;
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

  // Email/password register (UPDATED)
  const registerWithEmail = async (
    email: string,
    password: string,
    chosenRole?: UserRole,
    directoryIdentity?: DirectoryIdentityInput
  ) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      const uid = cred.user.uid;
      const defaultRole: UserRole = "seller";
      const roleToSave: UserRole = chosenRole ?? defaultRole;

      // Save user record
      await set(ref(rtdb, `users/${uid}`), {
        email: email.trim(),
        role: roleToSave,
        createdAt: Date.now(),
      });

      // NEW: create OR match directory listing on registration (if identity provided)
      if (directoryIdentity) {
        try {
          await upsertDirectoryListingForUser({
            uid,
            email: email.trim(),
            identity: directoryIdentity,
          });
        } catch (e) {
          // Registration should still succeed even if directory step fails
          console.warn("[authContext] directory upsert failed:", e);
        }
      }

      setUser(cred.user);
      setRole(roleToSave);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
