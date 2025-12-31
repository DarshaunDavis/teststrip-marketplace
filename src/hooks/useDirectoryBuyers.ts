// src/hooks/useDirectoryBuyers.ts
import { useEffect, useMemo, useState } from "react";
import { onValue, orderByChild, query, ref } from "firebase/database";

import { rtdb } from "../firebase";
import type { DirectoryBuyer } from "../types";

const MOCK_DIRECTORY: DirectoryBuyer[] = [
  {
    id: "dir-1",
    buyerName: "Fast Cash Buyers (Sponsored)",
    city: "New York",
    state: "NY",
    zip: "10001",
    fulfillment: "pickup",
    contactPhone: "(212) 555-0101",
    premium: true,
    note: "Same-day meetup available",
    createdAt: 1755033600000,
  },
  {
    id: "dir-2",
    buyerName: "Nationwide Mail-In (Sponsored)",
    city: "Austin",
    state: "TX",
    zip: "73301",
    fulfillment: "ship",
    contactEmail: "labels@nationwidebuyer.com",
    premium: true,
    note: "UPS label provided",
    createdAt: 1755033600000,
  },
  {
    id: "dir-3",
    buyerName: "Bronx Local Pickup",
    city: "Bronx",
    state: "NY",
    zip: "10458",
    fulfillment: "pickup",
    contactPhone: "(718) 555-0199",
    note: "Pickup only • Cash in hand",
    createdAt: 1755033600000,
  },
  {
    id: "dir-4",
    buyerName: "Ship & Get Paid",
    city: "Atlanta",
    state: "GA",
    zip: "30301",
    fulfillment: "ship",
    contactEmail: "support@shipgetpaid.com",
    note: "Ship for higher payout",
    createdAt: 1755033600000,
  },
];

export function useDirectoryBuyers() {
  const [buyers, setBuyers] = useState<DirectoryBuyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyersQuery = query(ref(rtdb, "directoryBuyers"), orderByChild("createdAt"));

    const unsubscribe = onValue(
      buyersQuery,
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
            buyerName: data.buyerName ?? data.name ?? "Buyer",
            city: data.city ?? "",
            state: data.state ?? "",
            zip: data.zip ?? "",
            fulfillment: (data.fulfillment as DirectoryBuyer["fulfillment"]) ?? "pickup",
            contactPhone: data.contactPhone ?? undefined,
            contactEmail: data.contactEmail ?? undefined,
            website: data.website ?? undefined,
            premium: !!data.premium,
            note: data.note ?? undefined,
            createdAt: data.createdAt ?? null,
          };
        });

        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setBuyers(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  const buyersOrMock = useMemo(() => {
    return buyers.length ? buyers : MOCK_DIRECTORY;
  }, [buyers]);

  return { buyers: buyersOrMock, loading };
}
