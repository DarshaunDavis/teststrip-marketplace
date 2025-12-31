// src/components/AdminPage.tsx
import React from "react";

interface AdminPageProps {
  onPostClick: () => void;
  onAddDirectoryBuyerClick?: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  onPostClick,
  onAddDirectoryBuyerClick,
}) => {
  return (
    <section className="tsm-feed" style={{ padding: "2rem" }}>
      <h1 className="tsm-feed-title">Admin</h1>
      <p className="tsm-feed-subtitle">
        Create unclaimed buyer ads, and populate the Buyer Directory.
      </p>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button className="tsm-btn-primary" type="button" onClick={onPostClick}>
          + Create Buyer Ad (Unclaimed)
        </button>

        <button
          className="tsm-btn-secondary"
          type="button"
          onClick={onAddDirectoryBuyerClick}
        >
          + Add Directory Buyer
        </button>
      </div>
    </section>
  );
};

export default AdminPage;
