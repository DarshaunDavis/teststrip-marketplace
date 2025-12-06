// src/LocationSeeder.tsx
import { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "./firebase";
import { STATE_CITY_DATA } from "./locationData";

export default function LocationSeeder() {
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    try {
      setStatus("working");
      setMessage(null);

      const updates: Record<string, unknown> = {};

      STATE_CITY_DATA.forEach((state) => {
        // State entry
        updates[`locations/states/${state.code}`] = {
          code: state.code,
          name: state.name,
        };

        // City entries
        state.cities.forEach((city) => {
          updates[`locations/cities/${state.code}/${city.id}`] = {
            id: city.id,
            name: city.name,
            stateCode: state.code,
          };
        });
      });

      await update(ref(db), updates);

      setStatus("done");
      setMessage(
        "Seeded 50 states and their cities under /locations/states and /locations/cities."
      );
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err?.message ?? "Failed to seed locations.");
    }
  };

  return (
    <div className="tsm-app">
      <main
        className="tsm-main"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          className="tsm-filters"
          style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}
        >
          <h1 className="tsm-filters-title">Seed States & Cities</h1>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Click the button once to write all U.S. states and a handful of
            major cities into Firebase Realtime Database.
          </p>

          <div className="tsm-filter-actions" style={{ marginTop: "1rem" }}>
            <button
              className="tsm-btn-primary"
              type="button"
              onClick={handleSeed}
              disabled={status === "working" || status === "done"}
            >
              {status === "working"
                ? "Seeding…"
                : status === "done"
                ? "Seeded"
                : "Seed locations"}
            </button>
          </div>

          {message && (
            <p
              style={{
                fontSize: "0.8rem",
                marginTop: "0.75rem",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
