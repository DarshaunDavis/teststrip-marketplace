// src/components/BuyerAdsFeed.tsx
import React from "react";
import type { BuyerAd } from "../types";

interface BuyerAdsFeedProps {
  ads: BuyerAd[];
  viewMode: "list" | "gallery";
  onViewModeChange: (mode: "list" | "gallery") => void;
  onAdClick: (index: number) => void;
}

const BuyerAdsFeed: React.FC<BuyerAdsFeedProps> = ({
  ads,
  viewMode,
  onViewModeChange,
  onAdClick,
}) => {
  const premiumAds = ads.filter((ad) => ad.premium);
  const normalAds = ads.filter((ad) => !ad.premium);

  // Always show at least 3 premium slots (real ads fill first, placeholders fill remaining)
  const PLACEHOLDER_COUNT = 3;
  const premiumSlotCount = Math.max(PLACEHOLDER_COUNT, premiumAds.length);

  // Build array of either real premium ads or placeholders
  const premiumDisplay = Array.from({ length: premiumSlotCount }).map(
    (_, index) => premiumAds[index] ?? null
  );

  return (
    <section className="tsm-feed">
      <div className="tsm-feed-header">
        <div>
          <h1 className="tsm-feed-title">Buyer Ads Near You</h1>
          <p className="tsm-feed-subtitle">
            {ads.length} buyer ads · nationwide ·{" "}
            {viewMode === "list" ? "List view" : "Gallery view"}
          </p>
        </div>

        <div className="tsm-view-toggle">
          <button
            className={`tsm-view-btn ${
              viewMode === "list" ? "tsm-view-btn-active" : ""
            }`}
            onClick={() => onViewModeChange("list")}
          >
            List
          </button>
          <button
            className={`tsm-view-btn ${
              viewMode === "gallery" ? "tsm-view-btn-active" : ""
            }`}
            onClick={() => onViewModeChange("gallery")}
          >
            Gallery
          </button>
        </div>
      </div>

      {/* PREMIUM SECTION */}
      <div className="tsm-section-label">
        <span>Premium Ads</span>
        <span className="tsm-section-label-right">Sponsored</span>
      </div>

      <div
        className={`tsm-card-grid ${
          viewMode === "list"
            ? "tsm-card-grid-list"
            : "tsm-card-grid-gallery"
        }`}
      >
        {premiumDisplay.map((adOrNull, index) => {
          if (adOrNull === null) {
            // PLACEHOLDER SPOT
            return (
              <article
                key={`ph-${index}`}
                className="tsm-ad-card tsm-ad-card-premium-placeholder"
                style={{
                  cursor: "default",
                  display: "flex",
                  flexDirection: "column",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  minHeight: 180,
                }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#475569",
                    marginBottom: "0.25rem",
                  }}
                >
                  Premium Spot Available
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Your ad could be featured here.
                </div>
              </article>
            );
          }

          // REAL PREMIUM AD
          const ad = adOrNull;
          const coverImage =
            ad.mainImageUrl ||
            (ad.imageUrls && ad.imageUrls.length > 0
              ? ad.imageUrls[0]
              : null);

          return (
            <article
              key={ad.id}
              className="tsm-ad-card"
              onClick={() => onAdClick(ads.indexOf(ad))}
              style={{ cursor: "pointer" }}
            >
              {viewMode === "gallery" && (
                <div className="tsm-ad-image-placeholder">
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt={ad.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "0.75rem 0.75rem 0 0",
                      }}
                    />
                  )}
                </div>
              )}

              <div className="tsm-ad-body">
                <div className="tsm-ad-title-row">
                  <h2 className="tsm-ad-title">{ad.title}</h2>
                  {ad.premium && (
                    <span className="tsm-pill tsm-pill-premium">
                      PREMIUM
                    </span>
                  )}
                </div>

                <p className="tsm-ad-meta">
                  {ad.productType} • {ad.city || "Nationwide"},{" "}
                  {ad.state} • ZIP {ad.zip || "N/A"}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* REGULAR ADS SECTION */}
      <div className="tsm-section-label" style={{ marginTop: "1.5rem" }}>
        <span>All Buyer Ads</span>
      </div>

      <div
        className={`tsm-card-grid ${
          viewMode === "list"
            ? "tsm-card-grid-list"
            : "tsm-card-grid-gallery"
        }`}
      >
        {normalAds.map((ad, index) => {
          const coverImage =
            ad.mainImageUrl ||
            (ad.imageUrls && ad.imageUrls.length > 0
              ? ad.imageUrls[0]
              : null);

          return (
            <article
              key={ad.id}
              className="tsm-ad-card"
              onClick={() => onAdClick(ads.indexOf(ad))}
              style={{ cursor: "pointer" }}
            >
              {viewMode === "gallery" && (
                <div className="tsm-ad-image-placeholder">
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt={ad.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "0.75rem 0.75rem 0 0",
                      }}
                    />
                  )}
                </div>
              )}

              <div className="tsm-ad-body">
                <div className="tsm-ad-title-row">
                  <h2 className="tsm-ad-title">{ad.title}</h2>
                  {ad.premium && (
                    <span className="tsm-pill tsm-pill-premium">
                      PREMIUM
                    </span>
                  )}
                </div>

                <p className="tsm-ad-meta">
                  {ad.productType} • {ad.city || "Nationwide"},{" "}
                  {ad.state} • ZIP {ad.zip || "N/A"}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default BuyerAdsFeed;
