// src/components/AdDetailsModal.tsx
import React from "react";
import type { BuyerAd } from "../types";

interface AdDetailsModalProps {
  ad: BuyerAd;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  activeImageUrl: string | null;
  onChangeImage: (url: string | null) => void;
}

const AdDetailsModal: React.FC<AdDetailsModalProps> = ({
  ad,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
  activeImageUrl,
  onChangeImage,
}) => {
  const mainImage = activeImageUrl || ad.mainImageUrl || null;

  return (
    <div
      className="tsm-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="tsm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720, width: "100%" }}
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
          <h3 className="tsm-filters-title" style={{ margin: 0 }}>
            {ad.title}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              style={{
                border: "none",
                background: "transparent",
                cursor: hasPrev ? "pointer" : "default",
                opacity: hasPrev ? 1 : 0.4,
                fontSize: "0.85rem",
              }}
            >
              ← Prev
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              style={{
                border: "none",
                background: "transparent",
                cursor: hasNext ? "pointer" : "default",
                opacity: hasNext ? 1 : 0.4,
                fontSize: "0.85rem",
              }}
            >
              Next →
            </button>

            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
            gap: "1rem",
          }}
        >
          {/* Left: image(s) */}
          <div>
            <div
              style={{
                width: "100%",
                paddingBottom: "65%",
                position: "relative",
                borderRadius: "0.75rem",
                overflow: "hidden",
                background:
                  "radial-gradient(circle at top, #e5f0ff, #e5e7eb 55%, #f3f4f6)",
              }}
            >
              {mainImage && (
                <img
                  src={mainImage}
                  alt={ad.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            {ad.imageUrls && ad.imageUrls.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                  overflowX: "auto",
                }}
              >
                {ad.imageUrls.slice(0, 4).map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChangeImage(url)}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      padding: 0,
                      background: "transparent",
                      width: 70,
                      height: 70,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div>
            <p className="tsm-ad-meta" style={{ marginBottom: "0.4rem" }}>
              {ad.category} • {ad.city || "Nationwide"}
              {ad.city && ad.state ? ", " : ""} {ad.state} • ZIP{" "}
              {ad.zip || "N/A"}
            </p>

            <p
              className="tsm-ad-price"
              style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}
            >
              ${ad.price}
            </p>

            <p className="tsm-ad-buyer" style={{ marginBottom: "0.75rem" }}>
              {ad.buyerName}
            </p>

            {ad.note && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#374151",
                  whiteSpace: "pre-wrap",
                  marginBottom: "0.75rem",
                }}
              >
                {ad.note}
              </p>
            )}

            {ad.createdAt && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#6b7280",
                  marginBottom: "0.75rem",
                }}
              >
                Posted on{" "}
                {new Date(ad.createdAt).toLocaleDateString()}
              </p>
            )}

            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#4b5563",
                  marginBottom: "0.5rem",
                }}
              >
                To sell to this buyer, contact them using the email on
                file:
              </p>

              <a href={`mailto:${ad.buyerName}`} style={{ display: "none" }} />

              <button
                type="button"
                className="tsm-btn-primary"
                onClick={() => {
                  window.location.href = `mailto:${ad.buyerName}`;
                }}
              >
                Email buyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetailsModal;
