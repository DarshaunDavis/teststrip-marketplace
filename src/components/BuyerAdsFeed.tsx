// src/components/BuyerAdsFeed.tsx
import React from "react";
import type { BuyerAd, UserRole } from "../types";

interface BuyerAdsFeedProps {
  ads: BuyerAd[];
  viewMode: "list" | "gallery";
  onViewModeChange: (mode: "list" | "gallery") => void;
  onAdClick: (index: number) => void;
  userRole: UserRole | null;
  showAllAds: boolean;
  onToggleShowAll: () => void;
}

const BuyerAdsFeed: React.FC<BuyerAdsFeedProps> = ({
  ads,
  viewMode,
  onViewModeChange,
  onAdClick,
  userRole,
  showAllAds,
  onToggleShowAll,
}) => {
  // Role-based filter for which ads appear in the feed
  const filteredAds = ads.filter((ad) => {
    // For now, treat missing postingRole as "buyer" to keep legacy ads visible
    const postingRole = ad.postingRole ?? "buyer";

    // Guests/admin/moderator see everything
    if (!userRole) return true;
    if (userRole === "admin" || userRole === "moderator") return true;

    // When "See all ads" is OFF
    if (!showAllAds) {
      if (userRole === "seller") {
        // sellers see only buyer ads
        return postingRole === "buyer";
      }
      if (userRole === "buyer") {
        // buyers see only seller ads
        return postingRole === "seller";
      }
      if (userRole === "wholesaler") {
        // wholesalers see only buyer ads
        return postingRole === "buyer";
      }
      return true;
    }

    // When "See all ads" is ON
    if (userRole === "seller" || userRole === "buyer") {
      // sellers & buyers see buyer + seller ads
      return postingRole === "buyer" || postingRole === "seller";
    }
    if (userRole === "wholesaler") {
      // wholesalers see buyer + wholesaler ads
      return postingRole === "buyer" || postingRole === "wholesaler";
    }

    return true;
  });

  // Premium vs normal ads from the filtered set
  const premiumAds = filteredAds.filter((ad) => ad.premium);
  const normalAds = filteredAds.filter((ad) => !ad.premium);

  // Always show at least 3 premium slots (real ads fill first, placeholders fill remaining)
  const PLACEHOLDER_COUNT = 3;
  const premiumSlotCount = Math.max(PLACEHOLDER_COUNT, premiumAds.length);

  // Build array of either real premium ads or placeholders
  const premiumDisplay = Array.from({ length: premiumSlotCount }).map(
    (_, index) => premiumAds[index] ?? null
  );

  const filteredCount = filteredAds.length;

  const showSeeAllToggle =
    userRole === "seller" ||
    userRole === "buyer" ||
    userRole === "wholesaler";

  return (
    <section className="tsm-feed">
      <div className="tsm-feed-header">
        <div>
          <h1 className="tsm-feed-title">Marketplace Ads Near You</h1>
          <p className="tsm-feed-subtitle">
            {filteredCount} ads · nationwide ·{" "}
            {viewMode === "list" ? "List view" : "Gallery view"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.35rem",
          }}
        >
          {showSeeAllToggle && (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "#4b5563",
              }}
            >
              <input
                type="checkbox"
                checked={showAllAds}
                onChange={onToggleShowAll}
                style={{ cursor: "pointer" }}
              />
              <span>See all ads</span>
            </label>
          )}

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
      </div>

      {/* Premium section */}
      <div className="tsm-section-label">
        <span>Premium Ads</span>
        <span className="tsm-section-label-right">Sponsored</span>
      </div>

      <div
        className={`tsm-card-grid tsm-card-grid-premium ${
          viewMode === "list"
            ? "tsm-card-grid-list"
            : "tsm-card-grid-gallery"
        }`}
      >
        {premiumDisplay.map((adOrNull, index) => {
          if (adOrNull === null) {
            // Placeholder premium slot
            return (
              <article
                key={`ph-${index}`}
                className="tsm-ad-card tsm-ad-card-premium-placeholder"
                style={{
                  cursor: "default",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1.25rem",
                }}
              >
                <div className="tsm-ad-premium-placeholder-title">
                  Premium Spot Available
                </div>
                <div className="tsm-ad-premium-placeholder-subtitle">
                  Your ad could be featured here.
                </div>
              </article>
            );
          }

          const ad = adOrNull;
          const coverImage = ad.imageUrls?.[0];

          return (
            <article
              key={ad.id}
              className="tsm-ad-card tsm-ad-card-premium"
              onClick={() => {
                const indexInFiltered = filteredAds.findIndex(
                  (x) => x.id === ad.id
                );
                if (indexInFiltered >= 0) {
                  onAdClick(indexInFiltered);
                }
              }}
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

      {/* All non-premium ads */}
      <div
        className="tsm-section-label"
        style={{ marginTop: "1.5rem" }}
      >
        <span>All Ads</span>
      </div>

      <div
        className={`tsm-card-grid ${
          viewMode === "list"
            ? "tsm-card-grid-list"
            : "tsm-card-grid-gallery"
        }`}
      >
        {normalAds.map((ad) => {
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
