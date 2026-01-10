// src/components/DirectoryFeed.tsx
import React from "react";
import type { DirectoryBuyer } from "../types";

function fulfillmentLabel(v: DirectoryBuyer["fulfillment"]): string {
  if (v === "pickup") return "Pickup";
  if (v === "ship") return "Shipping";
  return "Pickup or Shipping";
}

interface DirectoryFeedProps {
  buyers: DirectoryBuyer[];
  onBuyerClick: (index: number) => void;
}

const DirectoryFeed: React.FC<DirectoryFeedProps> = ({ buyers, onBuyerClick }) => {
  const premium = buyers.filter((b) => !!b.premium);
  const regular = buyers.filter((b) => !b.premium);

  const renderClaimLink = (b: DirectoryBuyer) => {
    if (!b.createdByAdmin || !b.contactPhone) return null;

    return (
    <a
      href={`/directory/${b.id}?claim=1`}
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: "0.4rem",
        fontSize: "0.75rem",
        color: "#2563eb",
        textDecoration: "underline",
        cursor: "pointer",
      }}
    >
      Is this your number? Click to claim this listing
    </a>
  );
};

  return (
    <section className="tsm-feed">
      <div className="tsm-feed-header">
        <div>
          <h1 className="tsm-feed-title">Buyer Directory</h1>
          <p className="tsm-feed-subtitle">
            Search buyers nationwide. Filter by pickup vs shipping.
          </p>
        </div>
      </div>

      <div className="tsm-section-label">
        <span>Sponsored</span>
        <span className="tsm-section-label-right">
          Boosted listings (top placement)
        </span>
      </div>

      <div className="tsm-card-grid tsm-card-grid-premium">
        {(premium.length ? premium : [{ id: "placeholder" } as any]).map((b) => {
          if (b.id === "placeholder") {
            return (
              <div
                key="p"
                className="tsm-ad-card tsm-ad-card-premium-placeholder"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem",
                  border: "2px dashed rgba(99, 178, 252, 0.6)",
                }}
              >
                <div>
                  <div className="tsm-ad-premium-placeholder-title">
                    Sponsored Spot
                  </div>
                  <div className="tsm-ad-premium-placeholder-subtitle">
                    Coming soon
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={b.id}
              type="button"
              className="tsm-ad-card"
              style={{ cursor: "pointer", textAlign: "left" }}
              onClick={() => onBuyerClick(buyers.indexOf(b))}
            >
              <div className="tsm-ad-body">
                <div className="tsm-ad-title-row">
                  <h3 className="tsm-ad-title">{b.buyerName}</h3>
                  <span className="tsm-pill tsm-pill-premium">SPONSORED</span>
                </div>

                <p className="tsm-ad-meta">
                  {b.city}, {b.state} • {b.zip}
                </p>

                <p className="tsm-ad-buyer">
                  <strong>{fulfillmentLabel(b.fulfillment)}</strong>
                </p>

                {b.note && <p className="tsm-ad-note">{b.note}</p>}

                {renderClaimLink(b)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="tsm-section-label" style={{ marginTop: "1rem" }}>
        <span>Directory</span>
        <span className="tsm-section-label-right">
          {regular.length} listings
        </span>
      </div>

      <div className="tsm-card-grid tsm-card-grid-list">
        {regular.map((b, idx) => (
          <button
            key={b.id}
            type="button"
            className="tsm-ad-card"
            style={{ cursor: "pointer", textAlign: "left" }}
            onClick={() => onBuyerClick(idx)}
          >
            <div className="tsm-ad-body">
              <h3 className="tsm-ad-title">{b.buyerName}</h3>

              <p className="tsm-ad-meta">
                {b.city}, {b.state} • {b.zip}
              </p>

              <p className="tsm-ad-buyer">
                <strong>{fulfillmentLabel(b.fulfillment)}</strong>
              </p>

              {b.note && <p className="tsm-ad-note">{b.note}</p>}

              {renderClaimLink(b)}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default DirectoryFeed;
