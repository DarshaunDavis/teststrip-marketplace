// src/types.ts

export type AdCategory = "Devices" | "Supplies" | "Test Strips";

// NEW: what kind of post is this?
export type PostType = "offer" | "want" | "build";
// offer  = seller
// want   = buyer
// build  = wholesaler

// NEW: what the UI lets the user pick as their role
export type PostingRole = "seller" | "buyer" | "wholesaler";

export type UserRole =
  | "seller"
  | "buyer"
  | "wholesaler"
  | "admin"
  | "moderator";

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
  createdAt?: number | null;
  mainImageUrl?: string;
  imageUrls?: string[];
  postingRole?: PostingRole;
  postType?: PostType;
}
