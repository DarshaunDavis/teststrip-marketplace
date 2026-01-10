// src/directoryService.ts
//
// Directory posting MUST follow the exact same pattern as Ads posting.
// Ads works because it strips undefined fields before calling RTDB `set()`.
// Realtime Database rejects `undefined` anywhere in the payload.

import { rtdb } from "./firebase";
import { ref as rtdbRef, push, set } from "firebase/database";

import type { FulfillmentPreference } from "./types";

// Types
// ─────────────────────────────────────────────

export interface CreateDirectoryBuyerInput {
  buyerName: string;
  city: string;
  state: string;
  zip: string;
  fulfillment: FulfillmentPreference;

  // At least one of these should be provided by the UI
  contactEmail?: string;
  contactPhone?: string;

  website?: string;
  note?: string;
  premium?: boolean;
}

// ─────────────────────────────────────────────
// Realtime Database: directoryBuyers
// ─────────────────────────────────────────────

export async function createDirectoryBuyer(
  input: CreateDirectoryBuyerInput
): Promise<string> {
  const buyersRef = rtdbRef(rtdb, "directoryBuyers");
  const newBuyerRef = push(buyersRef);

  // Remove undefined fields so RTDB doesn’t reject them (mirrors adsService.ts)
  const {
    contactEmail,
    contactPhone,
    website,
    note,
    premium,
    ...rest
  } = input;

  const payload: any = {
    ...rest,
    buyerName: rest.buyerName.trim(),
    city: rest.city.trim(),
    state: rest.state.trim(),
    zip: rest.zip.trim(),
    premium: !!premium,
    createdByAdmin: true,
    createdAt: Date.now(),
  };

  if (contactEmail) payload.contactEmail = contactEmail;
  if (contactPhone) payload.contactPhone = contactPhone;
  if (website) payload.website = website;
  if (note) payload.note = note;

  await set(newBuyerRef, payload);

  console.log("[createDirectoryBuyer] wrote directory buyer", newBuyerRef.key, payload);

  return newBuyerRef.key as string;
}
