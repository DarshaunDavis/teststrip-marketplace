// src/components/AdDetailsModal.tsx
import React, { useEffect } from "react";
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
  const {
    title,
    price,
    buyerName,
    city,
    state,
    zip,
    note,
    mainImageUrl,
    imageUrls,
    contactEmail,
    contactPhone,
    category,
    productType,
  } = ad;

  // Build flat list of all images (main + extra)
  const allImages: string[] = [
    ...(mainImageUrl ? [mainImageUrl] : []),
    ...(imageUrls ?? []),
  ];

  const displayedImage = activeImageUrl || allImages[0] || null;

  const handleThumbClick = (url: string) => {
    onChangeImage(url);
  };

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Keyboard accessibility: Esc to close, arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        onPrev();
        return;
      }

      if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        onNext();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext, onClose]);

  const hasPhone = !!contactPhone;
  const hasEmail = !!contactEmail;
  const hasAnyContact = hasPhone || hasEmail;

  return (
    <div
      className="tsm-ad-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Ad details"}
      onClick={handleBackdropClick}
    >
      <div className="tsm-ad-modal">
        {/* Header row: title + close */}
        <header className="tsm-ad-modal-header">
          <div className="tsm-ad-modal-header-main">
            <h2 className="tsm-ad-modal-title">{title}</h2>

            {(category || productType) && (
              <p className="tsm-ad-modal-tagline">
                {category && <span>{category}</span>}
                {category && productType && <span> • </span>}
                {productType && <span>{productType}</span>}
              </p>
            )}
          </div>

          <button
            type="button"
            className="tsm-ad-modal-close"
            onClick={onClose}
            aria-label="Close ad details"
          >
            ✕
          </button>
        </header>

        {/* Content: image + details */}
        <div className="tsm-ad-modal-body">
          {/* Media column */}
          <section className="tsm-ad-modal-media">
            <div className="tsm-ad-modal-main-image-wrapper">
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt={title || "Ad image"}
                  className="tsm-ad-modal-main-image"
                />
              ) : (
                <div className="tsm-ad-modal-main-image-placeholder">
                  <span>No photos uploaded</span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="tsm-ad-modal-thumbs">
                {allImages.map((url, idx) => {
                  const isActive = url === displayedImage;
                  return (
                    <button
                      key={`${url}-${idx}`}
                      type="button"
                      className={`tsm-ad-modal-thumb ${
                        isActive ? "tsm-ad-modal-thumb-active" : ""
                      }`}
                      onClick={() => handleThumbClick(url)}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="tsm-ad-modal-thumb-img"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Details column */}
          <section className="tsm-ad-modal-details">
            {/* Price + buyer */}
            <div className="tsm-ad-modal-price-row">
              <span className="tsm-ad-modal-price">
                {typeof price === "number" && price > 0
                  ? `$${price.toFixed(2)}`
                  : "Offer varies"}
              </span>
              {buyerName && (
                <span className="tsm-ad-modal-buyer-label">{buyerName}</span>
              )}
            </div>

            {/* Location */}
            {(city || state || zip) && (
              <p className="tsm-ad-modal-location">
                {city && <span>{city}</span>}
                {city && state && <span>, </span>}
                {state && <span>{state}</span>}
                {(city || state) && zip && <span> </span>}
                {zip && <span>{zip}</span>}
              </p>
            )}

            {/* Note / description */}
            {note && <p className="tsm-ad-modal-note">{note}</p>}

            {/* Contact block */}
            <div className="tsm-ad-modal-contact-card">
              <h3 className="tsm-ad-modal-contact-title">Contact Buyer</h3>

              {hasAnyContact ? (
                <div className="tsm-ad-modal-contact-row">
                  {hasPhone && (
                    <button
                      type="button"
                      className="tsm-ad-modal-contact-btn"
                      onClick={() =>
                        contactPhone &&
                        (window.location.href = `tel:${contactPhone}`)
                      }
                    >
                      Call
                    </button>
                  )}

                  {hasPhone && (
                    <button
                      type="button"
                      className="tsm-ad-modal-contact-btn"
                      onClick={() =>
                        contactPhone &&
                        (window.location.href = `sms:${contactPhone}`)
                      }
                    >
                      Text
                    </button>
                  )}

                  {hasEmail && (
                    <button
                      type="button"
                      className="tsm-ad-modal-contact-btn"
                      onClick={() =>
                        contactEmail &&
                        (window.location.href = `mailto:${contactEmail}`)
                      }
                    >
                      Email
                    </button>
                  )}
                </div>
              ) : (
                <p className="tsm-ad-modal-contact-line tsm-ad-modal-contact-muted">
                  Contact information will appear here when the buyer provides
                  it.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Footer: Previous / Next navigation */}
        <footer className="tsm-ad-modal-footer">
          <button
            type="button"
            className="tsm-ad-modal-nav-btn"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            ← Previous
          </button>
          <button
            type="button"
            className="tsm-ad-modal-nav-btn"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next →
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdDetailsModal;
