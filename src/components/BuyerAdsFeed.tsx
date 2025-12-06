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
        {ads.map((ad, index) => {
          const coverImage =
            ad.mainImageUrl ||
            (ad.imageUrls && ad.imageUrls.length > 0
              ? ad.imageUrls[0]
              : null);

          return (
            <article
              key={ad.id}
              className="tsm-ad-card"
              onClick={() => onAdClick(index)}
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
