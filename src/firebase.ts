import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAiG2DH7u692x3YPKpKtQm2RUwh11Tiwts",
  authDomain: "test-strip-marketplace-a1f47.firebaseapp.com",
  databaseURL: "https://test-strip-marketplace-a1f47-default-rtdb.firebaseio.com",
  projectId: "test-strip-marketplace-a1f47",
  storageBucket: "test-strip-marketplace-a1f47.firebasestorage.app",
  messagingSenderId: "298820392888",
  appId: "1:298820392888:web:b8266d3b0c12efb83ca14d",
};

const app = initializeApp(firebaseConfig);

// Auth   
export const auth = getAuth(app);

// Firestore (for other parts of the app that use `db`)
export const db = getFirestore(app);

// Realtime Database (for ads)
export const rtdb = getDatabase(app);

// Firestore handle specifically for ad images metadata
export const firestore = getFirestore(app);

// Storage for ad images
export const storage = getStorage(app);