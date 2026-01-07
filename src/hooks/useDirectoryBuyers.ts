// src/hooks/useDirectoryBuyers.ts
import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";

import { rtdb } from "../firebase";
import type { DirectoryBuyer, FulfillmentPreference } from "../types";

/**
 * 🔧 RTDB PATH
 * Update this if your admin writes directory buyers to a different node.
 *
 * Common options:
 * - "directoryBuyers"
 * - "directory/buyers"
 * - "buyersDirectory"
 */
const DIRECTORY_BUYERS_PATH = "directoryBuyers";

type UseDirectoryBuyersResult = {
  buyers: DirectoryBuyer[];
  loading: boolean;
  error: string | null;
};

function normalizeFulfillment(raw: any): FulfillmentPreference {
  const v = String(raw ?? "").toLowerCase();

  // accept both naming styles:
  // old: "ship"
  // new: "shipping"
  if (v === "pickup") return "pickup";
  if (v === "ship" || v === "shipping") return "ship";
  if (v === "both") return "both";

  // default (safe)
  return "pickup";
}

export function useDirectoryBuyers(): UseDirectoryBuyersResult {
  const [buyers, setBuyers] = useState<DirectoryBuyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const buyersRef = ref(rtdb, DIRECTORY_BUYERS_PATH);

    const unsubscribe = onValue(
      buyersRef,
      (snapshot) => {
        const val = snapshot.val();

        if (!val) {
          setBuyers([]);
          setLoading(false);
          return;
        }

        const list: DirectoryBuyer[] = Object.entries(val).map(([key, raw]) => {
          const data = raw as any;

          return {
            id: key,

            // allow either naming convention (buyerName vs name)
            buyerName: data.buyerName ?? data.name ?? "Buyer",

            city: data.city ?? "",
            state: data.state ?? "",
            zip: data.zip ?? "",

            // normalize "ship" vs "shipping" etc
            fulfillment: normalizeFulfillment(data.fulfillment),

            contactPhone: data.contactPhone ?? data.phone ?? undefined,
            contactEmail: data.contactEmail ?? data.email ?? undefined,
            website: data.website ?? undefined,

            // allow either premium/sponsored flag
            premium: !!(data.premium ?? data.sponsored),

            note: data.note ?? data.tagline ?? undefined,
            createdAt: data.createdAt ?? null,
          };
        });

        // newest first by default (your page can still re-sort after filtering)
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

        setBuyers(list);
        setLoading(false);
      },
      (err) => {
        setError(err?.message ?? "Failed to load directory buyers.");
        setBuyers([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // keep referential stability (optional)
  const stable = useMemo(() => buyers, [buyers]);

  return { buyers: stable, loading, error };
}
