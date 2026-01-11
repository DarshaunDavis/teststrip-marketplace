// src/components/ClaimDirectoryListingModal.tsx
import React from "react";
import type { DirectoryBuyer } from "../types";

interface ClaimDirectoryListingModalProps {
  buyer: DirectoryBuyer;
  onClose: () => void;
}

/**
 * MVP placeholder.
 * Confirms intent for signed-in users.
 * Real claim flow (OTP, admin review, UID attach) comes next.
 */
const ClaimDirectoryListingModal: React.FC<ClaimDirectoryListingModalProps> = ({
  buyer,
  onClose,
}) => {
  return (
    <div
      className="tsm-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="tsm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420 }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Claim this listing</h3>
          <button
            type="button"
            className="tsm-btn-ghost"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: 0 }}>
          Claiming is coming next. This confirms your click is being handled
          correctly for signed-in users.
        </p>

        {/* Listing summary */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "0.75rem",
            background: "#fafafa",
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {buyer.buyerName || "Unknown Buyer"}
          </div>

          <div style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
            <span style={{ color: "#6b7280" }}>Phone:</span>{" "}
            <strong>{buyer.contactPhone || "Not provided"}</strong>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            className="tsm-btn-primary"
            disabled
            style={{ flex: 1 }}
          >
            Claim (coming soon)
          </button>

          <button
            type="button"
            className="tsm-btn-secondary"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Not me
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimDirectoryListingModal;
