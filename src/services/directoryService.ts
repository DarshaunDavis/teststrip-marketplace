// src/services/directoryService.ts
//
// Directory writes MUST behave exactly like Ads writes.
// The Ads pipeline works because it strips undefined fields before calling RTDB `set()`.
// Realtime Database rejects `undefined` anywhere in the payload.

import { rtdb } from "../firebase";
import { push, ref as rtdbRef, set } from "firebase/database";

import type { FulfillmentPreference } from "../types";

export interface CreateDirectoryBuyerInput {
  buyerName: string;
  city: string;
  state: string;
  zip: string;
  fulfillment: FulfillmentPreference;

  contactPhone?: string;
  contactEmail?: string;
  website?: string;

  premium?: boolean;
  note?: string;
}

const DIRECTORY_BUYERS_PATH = "directoryBuyers";

export async function createDirectoryBuyer(
  input: CreateDirectoryBuyerInput
): Promise<string> {
  const buyersRef = rtdbRef(rtdb, DIRECTORY_BUYERS_PATH);
  const newBuyerRef = push(buyersRef);

  const { contactEmail, contactPhone, website, note, premium, ...rest } = input;

  // Build payload without undefined values (mirrors src/adsService.ts)
  const payload: any = {
    ...rest,
    buyerName: rest.buyerName.trim(),
    city: rest.city.trim(),
    state: rest.state.trim(),
    zip: rest.zip.trim(),
    premium: !!premium,
    createdAt: Date.now(),
  };

  const email = contactEmail?.trim();
  const phone = contactPhone?.trim();
  const site = website?.trim();
  const noteTrim = note?.trim();

  if (email) payload.contactEmail = email;
  if (phone) payload.contactPhone = phone;
  if (site) payload.website = site;
  if (noteTrim) payload.note = noteTrim;

  await set(newBuyerRef, payload);

  console.log(
    "[createDirectoryBuyer] wrote directory buyer",
    newBuyerRef.key,
    payload
  );

  return newBuyerRef.key as string;
}
