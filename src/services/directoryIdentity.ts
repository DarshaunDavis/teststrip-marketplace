// src/services/directoryIdentity.ts
import { get, push, query, ref, set, orderByChild, equalTo, update } from "firebase/database";
import { rtdb } from "../firebase";
import type { DirectoryBuyer, FulfillmentPreference } from "../types";

const DIRECTORY_BUYERS_PATH = "directoryBuyers";

/**
 * Normalize phone into digits only.
 * Example: "(555) 123-4567" -> "5551234567"
 */
export function normalizePhone(input: string | null | undefined): string | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  // Allow 10-digit US phones; if someone includes country code 1, trim to last 10.
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  if (digits.length === 10) return digits;

  // If it's not a valid 10-digit number, we still return null to avoid bad matches.
  return null;
}

/**
 * Normalize email (lowercase/trim).
 */
export function normalizeEmail(input: string | null | undefined): string | null {
  const raw = String(input ?? "").trim().toLowerCase();
  if (!raw) return null;
  // super light validation; we mainly want consistent matching
  if (!raw.includes("@")) return null;
  return raw;
}

type FindDirectoryMatchInput = {
  phone?: string | null;
  email?: string | null;
};

export async function findDirectoryListingByPhoneOrEmail(
  input: FindDirectoryMatchInput
): Promise<DirectoryBuyer | null> {
  const normalizedPhone = normalizePhone(input.phone);
  const normalizedEmail = normalizeEmail(input.email);

  // 1) Try phone match first (strongest identity signal in your flow)
  if (normalizedPhone) {
    const q = query(
      ref(rtdb, DIRECTORY_BUYERS_PATH),
      orderByChild("normalizedPhone"),
      equalTo(normalizedPhone)
    );

    const snap = await get(q);
    if (snap.exists()) {
      const firstKey = Object.keys(snap.val())[0];
      const raw = (snap.val() as any)[firstKey] as any;

      return {
        id: firstKey,
        buyerName: raw.buyerName ?? "Buyer",
        city: raw.city ?? "",
        state: raw.state ?? "",
        zip: raw.zip ?? "",
        fulfillment: (raw.fulfillment as FulfillmentPreference) ?? "pickup",
        contactPhone: raw.contactPhone ?? undefined,
        contactEmail: raw.contactEmail ?? undefined,
        website: raw.website ?? undefined,
        premium: !!raw.premium,
        note: raw.note ?? undefined,
        createdByAdmin: !!raw.createdByAdmin,
        ownerUid: raw.ownerUid ?? null,
        normalizedPhone: raw.normalizedPhone ?? null,
        normalizedEmail: raw.normalizedEmail ?? null,
        createdAt: raw.createdAt ?? null,
      };
    }
  }

  // 2) Then try email match
  if (normalizedEmail) {
    const q = query(
      ref(rtdb, DIRECTORY_BUYERS_PATH),
      orderByChild("normalizedEmail"),
      equalTo(normalizedEmail)
    );

    const snap = await get(q);
    if (snap.exists()) {
      const firstKey = Object.keys(snap.val())[0];
      const raw = (snap.val() as any)[firstKey] as any;

      return {
        id: firstKey,
        buyerName: raw.buyerName ?? "Buyer",
        city: raw.city ?? "",
        state: raw.state ?? "",
        zip: raw.zip ?? "",
        fulfillment: (raw.fulfillment as FulfillmentPreference) ?? "pickup",
        contactPhone: raw.contactPhone ?? undefined,
        contactEmail: raw.contactEmail ?? undefined,
        website: raw.website ?? undefined,
        premium: !!raw.premium,
        note: raw.note ?? undefined,
        createdByAdmin: !!raw.createdByAdmin,
        ownerUid: raw.ownerUid ?? null,
        normalizedPhone: raw.normalizedPhone ?? null,
        normalizedEmail: raw.normalizedEmail ?? null,
        createdAt: raw.createdAt ?? null,
      };
    }
  }

  return null;
}

export type EnsureDirectoryListingInput = {
  buyerName: string;
  city: string;
  state: string;
  zip?: string;

  fulfillment?: FulfillmentPreference;

  phone?: string | null;
  email?: string | null;
  website?: string | null;

  /**
   * When created via self-registration, this should be false.
   * When created via admin seeding, this should be true.
   */
  createdByAdmin?: boolean;

  /**
   * If we already know the user uid (post-registration), we can attach ownership.
   */
  ownerUid?: string | null;
};

/**
 * Ensure a directory listing exists for a buyer.
 * - If phone/email matches an existing listing, returns it.
 * - Otherwise, creates a new listing and returns it.
 */
export async function ensureDirectoryListing(
  input: EnsureDirectoryListingInput
): Promise<DirectoryBuyer> {
  const normalizedPhone = normalizePhone(input.phone);
  const normalizedEmail = normalizeEmail(input.email);

  const existing = await findDirectoryListingByPhoneOrEmail({
    phone: normalizedPhone,
    email: normalizedEmail,
  });

  if (existing) {
    // Optional: if listing exists but has no owner and we now have ownerUid, attach it.
    if (input.ownerUid && !existing.ownerUid) {
      await update(ref(rtdb, `${DIRECTORY_BUYERS_PATH}/${existing.id}`), {
        ownerUid: input.ownerUid,
      });
      return { ...existing, ownerUid: input.ownerUid };
    }
    return existing;
  }

  // Create new
  const nodeRef = push(ref(rtdb, DIRECTORY_BUYERS_PATH));
  const id = nodeRef.key;
  if (!id) throw new Error("Unable to create directory listing (missing key).");

  const now = Date.now();

  const payload: DirectoryBuyer = {
    id,
    buyerName: input.buyerName.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    zip: (input.zip ?? "").trim(),
    fulfillment: input.fulfillment ?? "pickup",

    contactPhone: input.phone ? String(input.phone).trim() : undefined,
    contactEmail: input.email ? String(input.email).trim() : undefined,
    website: input.website ? String(input.website).trim() : undefined,

    premium: false,
    note: undefined,

    createdByAdmin: !!input.createdByAdmin,

    ownerUid: input.ownerUid ?? null,
    normalizedPhone,
    normalizedEmail,

    createdAt: now,
  };

  await set(nodeRef, payload);

  return payload;
}
