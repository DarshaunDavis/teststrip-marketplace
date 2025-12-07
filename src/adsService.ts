// src/adsService.ts
import { rtdb, firestore, storage } from "./firebase";
import {
  ref as rtdbRef,
  push,
  set,
  update,
} from "firebase/database";

import {
  collection,
  addDoc,
  serverTimestamp as fsServerTimestamp,
} from "firebase/firestore";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import type { PostingRole } from "./types";

// Types
// ─────────────────────────────────────────────

export interface CreateBuyerAdInput {
  title: string;
  productType: string;
  category: string;
  zip: string;
  price: number;
  // At least one of these should be provided by the UI
  contactEmail?: string;
  contactPhone?: string;
  note?: string;
  ownerUid?: string | null;
  isAnonymous: boolean;
  // optional city/state in later steps
  city?: string;
  state?: string;
  // NEW: which role created this posting
  postingRole?: PostingRole;
}

// ─────────────────────────────────────────────
// Realtime Database: ads
// ─────────────────────────────────────────────

export async function createBuyerAd(input: CreateBuyerAdInput): Promise<string> {
  // ads/{autoId}
  const adsRef = rtdbRef(rtdb, "ads");
  const newAdRef = push(adsRef);

  const payload = {
    ...input,
    createdAt: Date.now(),
  };

  await set(newAdRef, payload);

  console.log("[createBuyerAd] wrote ad", newAdRef.key, payload);

  return newAdRef.key as string;
}

// ─────────────────────────────────────────────
// Firestore: analytics collection (optional)
// ─────────────────────────────────────────────

export async function logAdCreatedEvent(data: {
  adId: string;
  role: string;
  postType: string;
}) {
  try {
    const col = collection(firestore, "adEvents");
    await addDoc(col, {
      ...data,
      type: "created",
      createdAt: fsServerTimestamp(),
    });
  } catch (err) {
    console.warn("[logAdCreatedEvent] failed", err);
  }
}

// ─────────────────────────────────────────────
// Storage: ad images
// ─────────────────────────────────────────────

export async function uploadAdImages(
  adId: string,
  files: File[],
  ownerUid: string | null
): Promise<string[]> {
  if (!files.length) return [];

  const urls: string[] = [];

  for (const file of files) {
    try {
      const safeName = file.name.replace(/[^\w.-]/g, "_");
      const filePath = `adImages/${adId}/${Date.now()}-${safeName}`;
      const fileRef = storageRef(storage, filePath);

      console.log("[uploadAdImages] uploading", filePath);

      // Upload image to Firebase Storage
      await uploadBytes(fileRef, file);

      // Get download URL
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    } catch (err) {
      console.error("[uploadAdImages] failed for file", file.name, err);
    }
  }

  return urls;
}

export async function attachImagesToAd(
  adId: string,
  imageUrls: string[]
): Promise<void> {
  if (!adId || !imageUrls.length) return;

  const adRef = rtdbRef(rtdb, `ads/${adId}`);

  await update(adRef, {
    mainImageUrl: imageUrls[0], // first image as thumbnail
    imageUrls,
  });
}
