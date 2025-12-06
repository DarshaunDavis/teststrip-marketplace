// src/PostAdWizard.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { createBuyerAd, uploadAdImages, attachImagesToAd } from "./adsService";
import type { AdCategory, PostingRole } from "./types";

type WizardStep = 1 | 2 | 3 | 4;

interface PostAdWizardProps {
  onClose: () => void;
  defaultEmail: string;
  ownerUid: string | null;
  postingRole: PostingRole;
}

export default function PostAdWizard({
  onClose,
  defaultEmail,
  ownerUid,
  postingRole,
}: PostAdWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1: location
  const [location, setLocation] = useState<string>("Nationwide");

  // Step 2: core ad details
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AdCategory>("Test Strips");
  const [price, setPrice] = useState("");
  const [zip, setZip] = useState("");

  const [contactEmail, setContactEmail] = useState(defaultEmail);
  const [contactPhone, setContactPhone] = useState(""); // ⭐ NEW

  // Step 3: description / ad copy
  const [description, setDescription] = useState("");

  // Step 4: images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Global wizard state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const roleLabel =
    postingRole === "seller"
      ? "seller offer"
      : postingRole === "buyer"
      ? "buyer ad"
      : "wholesaler build";

  // Basic step-level validation
  const canGoNextFromStep1 = !!location;
  const canGoNextFromStep2 =
    !!title &&
    !!price &&
    !Number.isNaN(Number(price)) &&
    Number(price) > 0 &&
    (contactEmail.trim() !== "" || contactPhone.trim() !== ""); // ⭐ NEW

  const canGoNextFromStep3 = !!description;

  const handleNext = () => {
    setError(null);
    setSuccess(null);

    if (step === 1 && !canGoNextFromStep1) return;

    if (step === 2 && !canGoNextFromStep2) {
      setError("Please provide a title, valid price, and at least an email or phone number."); // ⭐ NEW
      return;
    }

    if (step === 3 && !canGoNextFromStep3) {
      setError("Please add a short description for your ad.");
      return;
    }

    setStep((prev) => (prev < 4 ? ((prev + 1) as WizardStep) : prev));
  };

  const handleBack = () => {
    setError(null);
    setSuccess(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev));
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const list = Array.from(e.target.files);

    // For now, cap at 4 images
    const limited = list.slice(0, 4);
    setImageFiles(limited);

    // Clean up old URLs
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    const previewUrls = limited.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const priceNum = Number(price);

    if (!title || !price || Number.isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid title and price.");
      return;
    }

    // ⭐ NEW — allow email OR phone
    if (!contactEmail.trim() && !contactPhone.trim()) {
      setError("Please provide at least an email or phone number.");
      return;
    }

    setBusy(true);
    try {
      // 1) Create the ad
      const adId = await createBuyerAd({
        title,
        productType: category,
        category,
        zip,
        price: priceNum,
        contactEmail: contactEmail.trim() || undefined, // ⭐ NEW
        contactPhone: contactPhone.trim() || undefined, // ⭐ NEW
        note: description,
        ownerUid: ownerUid ?? null,
        isAnonymous: false,
        city: location === "Nationwide" ? "" : location,
        state: "",
      });

      // 2) Upload images
      if (imageFiles.length) {
        const urls = await uploadAdImages(adId, imageFiles, ownerUid ?? null);

        // 3) Attach URLs
        if (urls.length) {
          await attachImagesToAd(adId, urls);
        }
      }

      setSuccess("Your buyer ad has been posted.");

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Unable to post ad. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tsm-filters" style={{ maxWidth: 520, width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3 className="tsm-filters-title">Create a posting</h3>
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

      {/* Step indicator */}
      <p
        style={{
          fontSize: "0.8rem",
          color: "#6b7280",
          marginBottom: "0.75rem",
        }}
      >
        Step {step} of 4 · Craigslist-style flow
      </p>

      {error && (
        <p style={{ color: "#b91c1c", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: "#15803d", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
          {success}
        </p>
      )}

      {/* STEP 2 – Details */}
      {step === 2 && (
        <div>
          <h2 className="tsm-wizard-title">
            {roleLabel.charAt(0).toUpperCase() + roleLabel.slice(1)} details
          </h2>

          <p className="tsm-wizard-subtitle">
            This is the core info people in this industry post across Craigslist.
          </p>

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
            <label className="tsm-label">Price you're offering ($)</label>
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

          {/* ⭐ NEW — phone input added right under email */}
          <div className="tsm-filter-group">
            <label className="tsm-label">Contact email (optional)</label>
            <input
              className="tsm-input"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="tsm-filter-group">
            <label className="tsm-label">Contact phone (optional)</label>
            <input
              className="tsm-input"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g., 555-123-4567"
            />
            <p className="tsm-help-text">
              You must provide at least one contact method: email or phone.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3 – Description */}
      {step === 3 && (
        <div>
          <h2 className="tsm-wizard-title">
            Describe your {roleLabel}
          </h2>
          <p className="tsm-wizard-subtitle">
            This is where you write your Craigslist-style ad copy.
          </p>

          <div className="tsm-filter-group">
            <label className="tsm-label">Description</label>
            <textarea
              className="tsm-input"
              style={{ minHeight: 120, resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include conditions, brands, payment methods, shipping options, etc."
            />
          </div>
        </div>
      )}

      {/* STEP 4 – Images + Publish */}
      {step === 4 && (
        <form onSubmit={handlePublish}>
          <h2 className="tsm-wizard-title">Add images</h2>
          <p className="tsm-wizard-subtitle">
            Photos help others trust that you&apos;re a real, serious poster.
            Add a few images (logo, example shipments, samples, etc.).
          </p>

          <div className="tsm-filter-group">
            <label className="tsm-label">Upload images</label>
            <input
              className="tsm-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
            />
            <p className="tsm-help-text">
              You can add up to 4 images for now. The first one will be treated
              as the main thumbnail later.
            </p>
          </div>

          {imageFiles.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: "0.5rem",
                marginTop: "0.75rem",
              }}
            >
              {imageFiles.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    padding: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {imagePreviews[idx] && (
                    <div
                      style={{
                        width: "100%",
                        height: 60,
                        marginBottom: "0.35rem",
                        overflow: "hidden",
                        borderRadius: "0.375rem",
                      }}
                    >
                      <img
                        src={imagePreviews[idx]}
                        alt={file.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      marginBottom: "0.25rem",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ color: "#6b7280" }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                  {idx === 0 && (
                    <div
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "0.7rem",
                        color: "#4b5563",
                      }}
                    >
                      Main thumbnail
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="tsm-wizard-actions" style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="tsm-btn-ghost"
              onClick={handleBack}
              disabled={busy}
            >
              Back
            </button>
            <button
              type="submit"
              className="tsm-btn-primary"
              disabled={busy}
            >
              {busy ? "Posting..." : "Publish ad"}
            </button>
          </div>
        </form>
      )}

      {/* Navigation for steps 1–3 */}
      {step <= 3 && (
        <div className="tsm-wizard-actions" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="tsm-btn-ghost"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
            {step > 1 && (
              <button
                type="button"
                className="tsm-btn-ghost"
                onClick={handleBack}
                disabled={busy}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className="tsm-btn-primary"
              onClick={handleNext}
              disabled={busy}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
