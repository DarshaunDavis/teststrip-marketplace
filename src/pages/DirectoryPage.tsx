// src/pages/DirectoryPage.tsx
import React from "react";

const DirectoryPage: React.FC = () => {
  return (
    <div className="tsm-page">
      <div className="tsm-card">
        <h1 className="tsm-title">Buyer Directory</h1>
        <p className="tsm-subtitle">
          Directory is coming next. For now, you can continue using the marketplace ads.
        </p>

        <div className="tsm-actions">
          <button className="tsm-primary" onClick={() => (window.location.href = "/marketplace")}>
            Go to Ads
          </button>

          <button className="tsm-secondary" onClick={() => (window.location.href = "/")}>
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
