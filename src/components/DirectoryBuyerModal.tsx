// src/components/DirectoryBuyerModal.tsx
import React from "react";
import type { DirectoryBuyer } from "../types";

function fulfillmentLabel(v: DirectoryBuyer["fulfillment"]): string {
  if (v === "pickup") return "Pickup";
  if (v === "ship") return "Shipping";
  return "Pickup or Shipping";
}

interface DirectoryBuyerModalProps {
  buyer: DirectoryBuyer;
  onClose: () => void;
}

const DirectoryBuyerModal: React.FC<DirectoryBuyerModalProps> = ({
  buyer,
  onClose,
}) => {
  return (
    <div
      className="tsm-ad-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="tsm-ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tsm-ad-modal-header">
          <div className="tsm-ad-modal-header-main">
            <h2 className="tsm-ad-modal-title">{buyer.buyerName}</h2>
            <p className="tsm-ad-modal-tagline">
              {buyer.city}, {buyer.state} • {buyer.zip} •{" "}
              {fulfillmentLabel(buyer.fulfillment)}
            </p>
          </div>

          <button
            type="button"
            className="tsm-ad-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="tsm-ad-modal-body" style={{ gridTemplateColumns: "1fr" }}>
          <div className="tsm-ad-modal-details">
            <p className="tsm-ad-modal-location">
              <strong>Fulfillment:</strong> {fulfillmentLabel(buyer.fulfillment)}
            </p>

            {buyer.note && <p className="tsm-ad-modal-note">{buyer.note}</p>}

            <div className="tsm-ad-modal-contact-card">
              <p className="tsm-ad-modal-contact-title">Contact</p>

              <p className="tsm-ad-modal-contact-line">
                <span className="tsm-ad-modal-contact-label">Phone:</span>{" "}
                {buyer.contactPhone ? (
                  <a href={`tel:${buyer.contactPhone}`}>{buyer.contactPhone}</a>
                ) : (
                  <span className="tsm-ad-modal-contact-muted">Not provided</span>
                )}
              </p>

              <p className="tsm-ad-modal-contact-line">
                <span className="tsm-ad-modal-contact-label">Email:</span>{" "}
                {buyer.contactEmail ? (
                  <a href={`mailto:${buyer.contactEmail}`}>{buyer.contactEmail}</a>
                ) : (
                  <span className="tsm-ad-modal-contact-muted">Not provided</span>
                )}
              </p>

              <p className="tsm-ad-modal-contact-line">
                <span className="tsm-ad-modal-contact-label">Website:</span>{" "}
                {buyer.website ? (
                  <a href={buyer.website} target="_blank" rel="noreferrer">
                    {buyer.website}
                  </a>
                ) : (
                  <span className="tsm-ad-modal-contact-muted">Not provided</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryBuyerModal;
