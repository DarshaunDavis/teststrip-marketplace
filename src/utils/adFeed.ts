// src/utils/adFeed.ts
import type { AdCategory, AdFilters, BuyerAd } from "../types";

export const DEFAULT_FILTERS: AdFilters = {
  zip: "",
  search: "",
  categoryDevices: true,
  categorySupplies: true,
  categoryTestStrips: true,
  priceMin: "",
  priceMax: "",
  sortBy: "newest",
};

export function applyFiltersForFeed(ads: BuyerAd[], filters: AdFilters): BuyerAd[] {
  let result = [...ads];

  // ZIP filter (exact 5-digit match)
  const zipTrim = filters.zip.trim();
  if (zipTrim && /^\d{5}$/.test(zipTrim)) {
    result = result.filter((ad) => (ad.zip ?? "").trim() === zipTrim);
  }

  // Category filter
  const allowedCategories: AdCategory[] = [];
  if (filters.categoryDevices) allowedCategories.push("Devices");
  if (filters.categorySupplies) allowedCategories.push("Supplies");
  if (filters.categoryTestStrips) allowedCategories.push("Test Strips");

  if (allowedCategories.length) {
    result = result.filter((ad) => allowedCategories.includes(ad.category));
  }

  // Price filters
  const min = filters.priceMin.trim() ? Number(filters.priceMin) : null;
  const max = filters.priceMax.trim() ? Number(filters.priceMax) : null;

  if (min !== null && !Number.isNaN(min)) {
    result = result.filter((ad) => ad.price >= min);
  }

  if (max !== null && !Number.isNaN(max)) {
    result = result.filter((ad) => ad.price <= max);
  }

  // Search (title + note)
  const q = filters.search.trim().toLowerCase();
  if (q) {
    result = result.filter((ad) => {
      const title = (ad.title ?? "").toLowerCase();
      const note = (ad.note ?? "").toLowerCase();
      return title.includes(q) || note.includes(q);
    });
  }

  // Sort
  if (filters.sortBy === "highest") {
    result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  } else {
    result.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }

  return result;
}
