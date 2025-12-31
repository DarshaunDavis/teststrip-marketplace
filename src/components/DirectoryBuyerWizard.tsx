// src/components/DirectoryBuyerWizard.tsx
import React, { useMemo, useState } from "react";
import { push, ref, set } from "firebase/database";

import { rtdb } from "../firebase";
import type { FulfillmentPreference } from "../types";

interface DirectoryBuyerWizardProps {
  onClose: () => void;
}

const DirectoryBuyerWizard: React.FC<DirectoryBuyerWizardProps> = ({ onClose }) => {
  const [buyerName, setBuyerName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [fulfillment, setFulfillment] = useState<FulfillmentPreference>("pickup");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [premium, setPremium] = useState(false);

  const canSubmit = useMemo(() => {
    return buyerName.trim().length > 0 && city.trim().length > 0 && state.trim().length > 0;
  }, [buyerName, city, state]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload = {
      buyerName: buyerName.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      fulfillment,
      contactPhone: contactPhone.trim() || null,
      contactEmail: contactEmail.trim() || null,
      website: website.trim() || null,
      note: note.trim() || null,
      premium,
      createdAt: Date.now(),
    };

    const node = push(ref(rtdb, "directoryBuyers"));
    await set(node, payload);
    onClose();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <h2 style={{ margin: 0 }}>Add Directory Buyer</h2>
        <button className="tsm-btn-ghost" type="button" onClick={onClose}>
          Close
        </button>
      </div>

      <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
        <div>
          <label className="tsm-label">Buyer Name</label>
          <input className="tsm-input" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.5fr", gap: "0.75rem" }}>
          <div>
            <label className="tsm-label">City</label>
            <input className="tsm-input" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="tsm-label">State</label>
            <input className="tsm-input" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="tsm-label">ZIP (optional)</label>
          <input
            className="tsm-input"
            inputMode="numeric"
            placeholder="e.g. 10458"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>

        <div>
          <label className="tsm-label">Fulfillment</label>
          <select
            className="tsm-select"
            value={fulfillment}
            onChange={(e) => setFulfillment(e.target.value as FulfillmentPreference)}
          >
            <option value="pickup">Pickup</option>
            <option value="ship">Shipping</option>
            <option value="both">Pickup or Shipping</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label className="tsm-label">Phone (optional)</label>
            <input className="tsm-input" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
          <div>
            <label className="tsm-label">Email (optional)</label>
            <input className="tsm-input" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="tsm-label">Website (optional)</label>
          <input className="tsm-input" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div>
          <label className="tsm-label">Note (optional)</label>
          <input className="tsm-input" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <label className="tsm-checkbox-row">
          <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} />
          Sponsored listing
        </label>

        <button className="tsm-btn-primary" type="button" onClick={handleSubmit} disabled={!canSubmit}>
          Save to Directory
        </button>
      </div>
    </div>
  );
};

export default DirectoryBuyerWizard;
