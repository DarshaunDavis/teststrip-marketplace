// src/components/SellForm.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import type { AdCategory, PostingRole } from "../types";
import { createBuyerAd } from "../adsService";

interface SellFormProps {
  user: { email?: string | null } | null;
  postingRole: PostingRole;
}

const SellForm: React.FC<SellFormProps> = ({ user, postingRole }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AdCategory>("Test Strips");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState("");
  const [zip, setZip] = useState("");
  const [note, setNote] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!contactEmail) {
      setError("Please provide a contact email.");
      return;
    }

    setBusy(true);
    try {
      await createBuyerAd({
        title,
        productType: productType || category,
        category,
        zip,
        price: priceNum,
        contactEmail,
        note,
        ownerUid: user ? (user as any).uid ?? null : null,
        isAnonymous: false,
        postingRole,
      });

      setTitle("");
      setProductType("");
      setPrice("");
      setZip("");
      setNote("");
      if (!user) setContactEmail("");

      setSuccess("Your buyer ad has been posted.");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Unable to create ad. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const roleHeading =
    postingRole === "seller"
      ? "Post a Seller Offer"
      : postingRole === "buyer"
        ? "Post a Buyer Ad"
        : "Post a Wholesaler Build";

  return (
    <section
      className="tsm-feed"
      style={{
        justifyContent: "center",
        padding: "2.5rem 1.5rem",
      }}
    >
      <div
        className="tsm-filters"
        style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}
      >
        <h3 className="tsm-filters-title">{roleHeading}</h3>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          You must be signed in to post buyer ads. We’ll use your account email
          as the primary contact for this ad.
        </p>


        {error && (
          <p
            style={{
              color: "#b91c1c",
              fontSize: "0.8rem",
              marginTop: "0.5rem",
            }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            style={{
              color: "#15803d",
              fontSize: "0.8rem",
              marginTop: "0.5rem",
            }}
          >
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <div className="tsm-filter-group">
            <label className="tsm-label">Title</label>
            <input
              className="tsm-input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Buying FreeStyle Lite 100ct"
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Category</label>
            <select
              className="tsm-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as AdCategory)}
            >
              <option value="Devices">Devices</option>
              <option value="Supplies">Supplies</option>
              <option value="Test Strips">Test Strips</option>
            </select>
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Product type</label>
            <input
              className="tsm-input"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., OneTouch Ultra 50ct"
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">
              Price you&apos;re offering ($)
            </label>
            <input
              className="tsm-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 20"
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">ZIP</label>
            <input
              className="tsm-input"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g., 30301"
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Contact email</label>
            <input
              className="tsm-input"
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Notes (optional)</label>
            <textarea
              className="tsm-input"
              style={{ minHeight: 80, resize: "vertical" }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any extra details or conditions..."
            />
          </div>

          <div
            className="tsm-filter-actions"
            style={{ marginTop: "0.75rem" }}
          >
            <button
              className="tsm-btn-primary"
              type="submit"
              disabled={busy}
            >
              {busy ? "Posting..." : "Post ad"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SellForm;
