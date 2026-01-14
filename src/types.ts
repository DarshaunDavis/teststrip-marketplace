// src/types.ts

export type AdCategory = "Devices" | "Supplies" | "Test Strips";

// NEW: what kind of post is this?
export type PostType = "offer" | "want" | "build";
// offer  = seller
// want   = buyer
// build  = wholesaler

// NEW: what the UI lets the user pick as their role
export type PostingRole = "seller" | "buyer" | "wholesaler";

export type UserRole = "seller" | "buyer" | "wholesaler" | "admin" | "moderator";

export interface BuyerAd {
  id: string;
  title: string;
  productType: string;
  category: AdCategory;
  city: string;
  state: string;
  zip: string;
  price: number;
  buyerName: string;
  contactEmail?: string;
  contactPhone?: string;
  premium?: boolean;
  note?: string;
  createdByAdmin?: boolean;
  createdAt?: number | null;
  mainImageUrl?: string;
  imageUrls?: string[];
  postingRole?: PostingRole;
  postType?: PostType;
}

export interface AdFilters {
  zip: string;
  search: string;
  categoryDevices: boolean;
  categorySupplies: boolean;
  categoryTestStrips: boolean;
  priceMin: string;
  priceMax: string;
  sortBy: "newest" | "highest";
}

// ─────────────────────────────────────────────
// Directory (Buyer Listings)
// ─────────────────────────────────────────────

export type FulfillmentPreference = "pickup" | "ship" | "both";

export interface DirectoryBuyer {
  id: string;

  buyerName: string;
  city: string;
  state: string;
  zip: string;

  // pickup vs ship vs both
  fulfillment: FulfillmentPreference;

  contactPhone?: string;
  contactEmail?: string;
  website?: string;

  premium?: boolean; // sponsored placement
  note?: string;

  // created by admin = show claim link if contactPhone exists
  createdByAdmin?: boolean;

  // NEW: ownership + identity (needed for auto-attach on registration + future claim)
  ownerUid?: string | null;
  normalizedPhone?: string | null;
  normalizedEmail?: string | null;

  createdAt?: number | null;
}

export interface DirectoryFilters {
  zip: string;
  search: string;
  fulfillment: "any" | "pickup" | "ship";
  sortBy: "newest" | "name";
}
