// src/components/AdminPage.tsx
import React from "react";

interface AdminPageProps {
  onPostClick: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onPostClick }) => {
  return (
    <section
      className="tsm-feed"
      style={{
        justifyContent: "flex-start",
        padding: "2.5rem 1.5rem",
      }}
    >
      <div
        className="tsm-filters"
        style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}
      >
        <h3 className="tsm-filters-title">Admin Controls</h3>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Use this panel to seed the marketplace with starter ads.
          For MVP, all ads created here will be{' '}
          <strong>buyer ads</strong> marked as <strong>unclaimed</strong>.
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <button
            className="tsm-btn-primary"
            type="button"
            onClick={onPostClick}
          >
            + Post buyer ad (unclaimed)
          </button>
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Later, we&apos;ll add &quot;claim this ad&quot; so real buyers
            can take ownership.
          </span>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
