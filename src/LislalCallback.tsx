// src/LislalCallback.tsx
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signInWithCustomToken } from "firebase/auth";

export default function LislalCallback() {
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState<string>(
    "Signing you in with Lislal ID..."
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("firebaseCustomToken");
    const error = params.get("error");

    if (error) {
      setStatus("error");
      setMessage(decodeURIComponent(error));
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage("Missing token from Lislal ID.");
      return;
    }

    signInWithCustomToken(auth, token)
      .then(() => {
        // Replace URL and reload into the normal app flow
        window.location.replace("/");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setMessage(err.message ?? "Unable to complete Lislal ID sign-in.");
      });
  }, []);

  return (
    <div className="tsm-app">
      <main
        className="tsm-main"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="tsm-filters" style={{ maxWidth: 420, width: "100%" }}>
          <h3 className="tsm-filters-title">Lislal ID</h3>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {status === "working"
              ? message
              : `Lislal sign-in failed: ${message}`}
          </p>
          {status === "error" && (
            <div className="tsm-filter-actions" style={{ marginTop: "0.75rem" }}>
              <button
                className="tsm-btn-primary"
                onClick={() => window.location.replace("/")}
              >
                Back to home
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
