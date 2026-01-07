// src/components/AddDirectoryBuyerModal.tsx
//
// "Become Apple" version: this is a line-by-line clone of the working Ads submit pattern
// (see src/components/SellForm.tsx and src/adsService.ts), adjusted for directory buyers.

import React, { useState } from "react";
import type { FormEvent } from "react";

import type { FulfillmentPreference } from "../types";
import { createDirectoryBuyer } from "../directoryService";

type Props = {
  onClose: () => void;
};

const AddDirectoryBuyerModal: React.FC<Props> = ({ onClose }) => {
  const [buyerName, setBuyerName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [fulfillment, setFulfillment] =
    useState<FulfillmentPreference>("pickup");

  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [premium, setPremium] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const nameTrim = buyerName.trim();
    const cityTrim = city.trim();
    const stateTrim = state.trim();
    const zipTrim = zip.trim();

    if (!nameTrim) {
      setError("Please enter a buyer name.");
      return;
    }

    if (!stateTrim) {
      setError("Please enter a state (e.g., NY).");
      return;
    }

    if (zipTrim && !/^\d{5}$/.test(zipTrim)) {
      setError("ZIP must be exactly 5 digits (or leave blank).");
      return;
    }

    const emailTrim = contactEmail.trim();
    const phoneTrim = contactPhone.trim();

    if (!emailTrim && !phoneTrim) {
      setError("Please provide at least an email or phone number.");
      return;
    }

    setBusy(true);
    try {
      console.log("[AddDirectoryBuyerModal] posting directory buyer...");

      // IMPORTANT: Pass raw strings. The service strips undefined exactly like adsService.
      await createDirectoryBuyer({
        buyerName: nameTrim,
        city: cityTrim,
        state: stateTrim,
        zip: zipTrim,
        fulfillment,
        contactEmail: emailTrim || undefined,
        contactPhone: phoneTrim || undefined,
        website: website.trim() || undefined,
        note: note.trim() || undefined,
        premium,
      });

      setSuccess("Directory buyer saved.");

      // Keep the same UX as Ads: show success state, then close.
      setTimeout(() => onClose(), 750);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Unable to save directory buyer. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="tsm-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="tsm-modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h3 className="tsm-filters-title" style={{ margin: 0 }}>
            Add Directory Buyer
          </h3>

          <button
            className="tsm-btn-ghost"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <p className="tsm-help-text" style={{ marginTop: "0.5rem" }}>
          Exact 5-digit ZIP is best for filtering.
        </p>

        {error && (
          <p style={{ color: "#b91c1c", fontSize: "0.85rem", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "#15803d", fontSize: "0.85rem", marginTop: "0.5rem" }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <div className="tsm-filter-group">
            <label className="tsm-label">Buyer Name</label>
            <input
              className="tsm-input"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Example Buyer LLC"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.5fr", gap: "0.75rem" }}>
            <div className="tsm-filter-group">
              <label className="tsm-label">City</label>
              <input
                className="tsm-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Albany"
              />
            </div>

            <div className="tsm-filter-group">
              <label className="tsm-label">State</label>
              <input
                className="tsm-input"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
              />
            </div>
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">ZIP (optional)</label>
            <input
              className="tsm-input"
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="10458"
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Fulfillment</label>
            <select
              className="tsm-select"
              value={fulfillment}
              onChange={(e) => setFulfillment(e.target.value as FulfillmentPreference)}
            >
              <option value="pickup">Pickup</option>
              <option value="ship">Shipping</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="tsm-filter-group">
              <label className="tsm-label">Contact Phone</label>
              <input
                className="tsm-input"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="347..."
              />
            </div>

            <div className="tsm-filter-group">
              <label className="tsm-label">Contact Email</label>
              <input
                className="tsm-input"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="buyer@buyer.com"
              />
            </div>
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Website (optional)</label>
            <input
              className="tsm-input"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="somewebsite.com"
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Note / Tagline (optional)</label>
            <input
              className="tsm-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="UPS label provided"
            />
          </div>

          <label className="tsm-checkbox-row" style={{ marginTop: "0.5rem" }}>
            <input
              type="checkbox"
              checked={premium}
              onChange={(e) => setPremium(e.target.checked)}
            />
            Sponsored (Premium)
          </label>

          <div className="tsm-filter-actions" style={{ marginTop: "0.75rem" }}>
            <button
              className="tsm-btn-ghost"
              type="button"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>

            <button className="tsm-btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save Buyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDirectoryBuyerModal;
