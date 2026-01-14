// src/components/AuthPanel.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../authContext";
import type { FulfillmentPreference } from "../types";

interface AuthPanelProps {
  onClose: () => void;
}

const AuthPanel: React.FC<AuthPanelProps> = ({ onClose }) => {
  const {
    user,
    loading,
    signInWithEmail,
    registerWithEmail,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerRole, setRegisterRole] = useState<"buyer" | "seller" | null>(
    null
  );

  // NEW: directory identity fields (for register flow)
  const [listingName, setListingName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [fulfillment, setFulfillment] =
    useState<FulfillmentPreference>("pickup");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        onClose();
        return;
      }

      // REGISTER
      if (!registerRole) {
        setError("Please tell us whether you're looking to sell or buy.");
        setBusy(false);
        return;
      }

      const emailTrim = email.trim();
      const passwordTrim = password;

      const nameTrim = listingName.trim();
      const phoneTrim = phone.trim();
      const cityTrim = city.trim();
      const stateTrim = state.trim();
      const zipTrim = zip.trim();

      // Required for directory identity (MVP)
      if (!nameTrim) {
        setError("Please enter your business name (or your name).");
        setBusy(false);
        return;
      }

      // phone required (used as primary claim/match key)
      const phoneDigits = phoneTrim.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        setError("Please enter a valid phone number (10 digits).");
        setBusy(false);
        return;
      }

      if (!cityTrim || !stateTrim) {
        setError("Please enter your city and state.");
        setBusy(false);
        return;
      }

      await registerWithEmail(emailTrim, passwordTrim, registerRole, {
        phone: phoneTrim,
        listingName: nameTrim,
        city: cityTrim,
        state: stateTrim,
        zip: zipTrim || undefined,
        fulfillment,
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleLislal = () => {
    alert("Lislal ID login will be integrated here later.");
  };

  const handleApple = () => {
    alert("Apple / device ID login coming soon.");
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="tsm-filters">
        <h3 className="tsm-filters-title">Account</h3>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Signed in as <strong>{user.email}</strong>
        </p>
        <div className="tsm-filter-actions" style={{ marginTop: "0.75rem" }}>
          <button
            className="tsm-btn-primary"
            onClick={async () => {
              await signOut();
              onClose();
            }}
          >
            Sign out
          </button>
          <button className="tsm-btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tsm-filters">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 className="tsm-filters-title">
          {mode === "login" ? "Sign in" : "Create an account"}
        </h3>
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

      <form onSubmit={handleSubmit} style={{ marginTop: "0.5rem" }}>
        <div className="tsm-filter-group" style={{ marginBottom: "0.8rem" }}>
          <label className="tsm-label">Email</label>
          <input
            className="tsm-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
        </div>

        <div className="tsm-filter-group" style={{ marginBottom: "0.8rem" }}>
          <label className="tsm-label">Password</label>
          <input
            className="tsm-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
        </div>

        {mode === "register" && (
          <>
            <div className="tsm-filter-group" style={{ marginBottom: "0.8rem" }}>
              <label className="tsm-label">Are you looking to sell or buy?</label>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "0.35rem",
                  fontSize: "0.9rem",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={registerRole === "seller"}
                    onChange={() => setRegisterRole("seller")}
                    disabled={busy}
                  />
                  <span>Sell</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={registerRole === "buyer"}
                    onChange={() => setRegisterRole("buyer")}
                    disabled={busy}
                  />
                  <span>Buy</span>
                </label>
              </div>
            </div>

            {/* NEW: Directory identity section */}
            <div
              style={{
                marginTop: "0.75rem",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "0.75rem",
              }}
            >
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "#6b7280" }}>
                This info creates (or matches) your directory listing.
              </p>

              <div className="tsm-filter-group" style={{ marginBottom: "0.8rem" }}>
                <label className="tsm-label">Business name (or your name)</label>
                <input
                  className="tsm-input"
                  value={listingName}
                  onChange={(e) => setListingName(e.target.value)}
                  placeholder="Example Buyer LLC"
                  disabled={busy}
                />
              </div>

              <div className="tsm-filter-group" style={{ marginBottom: "0.8rem" }}>
                <label className="tsm-label">Phone number</label>
                <input
                  className="tsm-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(347) 555-1234"
                  disabled={busy}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 0.6fr",
                  gap: "0.75rem",
                  marginBottom: "0.8rem",
                }}
              >
                <div className="tsm-filter-group" style={{ marginBottom: 0 }}>
                  <label className="tsm-label">City</label>
                  <input
                    className="tsm-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Albany"
                    disabled={busy}
                  />
                </div>
                <div className="tsm-filter-group" style={{ marginBottom: 0 }}>
                  <label className="tsm-label">State</label>
                  <input
                    className="tsm-input"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="tsm-filter-group" style={{ marginBottom: "0.8rem" }}>
                <label className="tsm-label">ZIP (optional)</label>
                <input
                  className="tsm-input"
                  inputMode="numeric"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="10458"
                  disabled={busy}
                />
              </div>

              <div className="tsm-filter-group" style={{ marginBottom: "0.8rem" }}>
                <label className="tsm-label">Fulfillment</label>
                <select
                  className="tsm-select"
                  value={fulfillment}
                  onChange={(e) => setFulfillment(e.target.value as FulfillmentPreference)}
                  disabled={busy}
                >
                  <option value="pickup">Pickup</option>
                  <option value="ship">Shipping</option>
                  <option value="both">Pickup or Shipping</option>
                </select>
              </div>
            </div>
          </>
        )}

        {error && <p style={{ color: "#b91c1c", fontSize: "0.8rem" }}>{error}</p>}

        <div className="tsm-filter-actions" style={{ marginTop: "0.5rem" }}>
          <button className="tsm-btn-primary" type="submit" disabled={busy}>
            {mode === "login" ? "Sign in" : busy ? "Registering..." : "Register"}
          </button>
          <button
            className="tsm-btn-ghost"
            type="button"
            onClick={() => {
              setMode((m) => (m === "login" ? "register" : "login"));
              setError(null);
            }}
            disabled={busy}
          >
            {mode === "login" ? "Create account" : "Have an account? Sign in"}
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: "0.75rem",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "0.75rem",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: "0 0 0.5rem" }}>Or continue with</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            className="tsm-btn-ghost"
            type="button"
            onClick={handleGoogle}
            disabled={busy}
          >
            Google
          </button>
          <button className="tsm-btn-ghost" type="button" onClick={handleLislal}>
            Lislal ID (coming soon)
          </button>
          <button className="tsm-btn-ghost" type="button" onClick={handleApple}>
            Apple / device ID (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;
