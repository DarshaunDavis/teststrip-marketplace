import React, { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";

import { useAuth } from "../authContext";
import { rtdb } from "../firebase";

import Header from "../components/Header";
import Footer from "../components/Footer";

import type { DirectoryBuyer } from "../types";

function fulfillmentLabel(v: DirectoryBuyer["fulfillment"]): string {
  if (v === "pickup") return "Pickup";
  if (v === "ship") return "Shipping";
  return "Pickup or Shipping";
}

function getBuyerIdFromPath(pathname: string): string | null {
  // expects /directory/:buyerId
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  if (parts[0] !== "directory") return null;
  return parts[1] || null;
}

const DirectoryBuyerPage: React.FC = () => {
  const { user, loading, role } = useAuth();
  const isGuest = !user;

  const buyerId = useMemo(
    () => getBuyerIdFromPath(window.location.pathname),
    []
  );

  const [buyer, setBuyer] = useState<DirectoryBuyer | null>(null);
  const [buyerLoading, setBuyerLoading] = useState(true);
  const [buyerError, setBuyerError] = useState<string | null>(null);

  useEffect(() => {
    if (!buyerId) {
      setBuyer(null);
      setBuyerLoading(false);
      setBuyerError("Missing buyer id.");
      return;
    }

    setBuyerLoading(true);
    setBuyerError(null);

    const buyerRef = ref(rtdb, `directoryBuyers/${buyerId}`);

    const unsubscribe = onValue(
      buyerRef,
      (snap) => {
        if (!snap.exists()) {
          setBuyer(null);
          setBuyerLoading(false);
          return;
        }

        const data = snap.val() as any;

        setBuyer({
          id: buyerId,
          buyerName: data.buyerName ?? data.name ?? "Buyer",
          city: data.city ?? "",
          state: data.state ?? "",
          zip: data.zip ?? "",
          fulfillment: data.fulfillment ?? "pickup",
          contactPhone: data.contactPhone ?? data.phone ?? undefined,
          contactEmail: data.contactEmail ?? data.email ?? undefined,
          website: data.website ?? undefined,
          premium: !!(data.premium ?? data.sponsored),
          note: data.note ?? data.tagline ?? undefined,
          createdAt: data.createdAt ?? null,
          createdByAdmin: !!data.createdByAdmin,
        });

        setBuyerLoading(false);
      },
      (err) => {
        setBuyer(null);
        setBuyerLoading(false);
        setBuyerError(err?.message ?? "Unable to load listing.");
      }
    );

    return () => unsubscribe();
  }, [buyerId]);

  return (
    <div className="tsm-app">
      <Header
        navMode="site"
        siteActive="directory"
        userEmail={user?.email ?? null}
        loading={loading}
        isGuest={isGuest}
        userRole={role}
      />

      <main className="tsm-main">
        <section className="tsm-feed" style={{ padding: "2rem" }}>
          {buyerLoading ? (
            <>
              <h1 className="tsm-feed-title">Loading listing…</h1>
              <p className="tsm-feed-subtitle">Please wait.</p>
            </>
          ) : buyerError ? (
            <>
              <h1 className="tsm-feed-title">Listing error</h1>
              <p className="tsm-feed-subtitle">{buyerError}</p>
            </>
          ) : !buyer ? (
            <>
              <h1 className="tsm-feed-title">Listing not found</h1>
              <p className="tsm-feed-subtitle">
                This directory listing may have been removed or the link is
                incorrect.
              </p>
            </>
          ) : (
            <>
              <h1 className="tsm-feed-title">{buyer.buyerName}</h1>
              <p className="tsm-feed-subtitle">
                {buyer.city}, {buyer.state}
                {buyer.zip ? ` • ${buyer.zip}` : ""} •{" "}
                {fulfillmentLabel(buyer.fulfillment)}
              </p>

              {buyer.note && (
                <div style={{ marginTop: "1rem" }}>
                  <p style={{ margin: 0 }}>{buyer.note}</p>
                </div>
              )}

              <div
                style={{
                  marginTop: "1.25rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Contact</h3>

                <p style={{ margin: "0.25rem 0" }}>
                  <strong>Phone:</strong>{" "}
                  {buyer.contactPhone ? (
                    <a href={`tel:${buyer.contactPhone}`}>{buyer.contactPhone}</a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                <p style={{ margin: "0.25rem 0" }}>
                  <strong>Email:</strong>{" "}
                  {buyer.contactEmail ? (
                    <a href={`mailto:${buyer.contactEmail}`}>
                      {buyer.contactEmail}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                <p style={{ margin: "0.25rem 0" }}>
                  <strong>Website:</strong>{" "}
                  {buyer.website ? (
                    <a href={buyer.website} target="_blank" rel="noreferrer">
                      {buyer.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <h3 style={{ marginTop: 0 }}>Price list</h3>
                <p style={{ margin: 0, color: "#6b7280" }}>
                  Coming next: optional buyer price list (this is where we’ll
                  decide “inline” vs “tabbed section” vs “expand/collapse”).
                </p>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DirectoryBuyerPage;
