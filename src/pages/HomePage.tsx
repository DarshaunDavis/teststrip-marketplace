// src/pages/HomePage.tsx
import React from "react";

const HomePage: React.FC = () => {
  const go = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="tsm-page">
      <div className="tsm-card">
        <h1 className="tsm-title">Test Strip Marketplace</h1>
        <p className="tsm-subtitle">
          Find what you need fast — browse marketplace ads or explore the buyer directory.
        </p>

        <div className="tsm-actions">
          <button className="tsm-primary" onClick={() => go("/marketplace")}>
            Browse Ads
          </button>

          <button className="tsm-secondary" onClick={() => go("/directory")}>
            Browse Directory
          </button>
        </div>

        <div className="tsm-links">
          <a href="/terms">Terms</a>
          <span className="tsm-dot">•</span>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
