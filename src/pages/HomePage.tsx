// src/pages/HomePage.tsx
import React, { useMemo, useState } from "react";

const HomePage: React.FC = () => {
  const [query, setQuery] = useState("");

  const directoryUrl = useMemo(() => {
    const q = query.trim();
    return q ? `/directory?q=${encodeURIComponent(q)}` : "/directory";
  }, [query]);

  return (
    <div className="tsm-home">
      {/* Top Nav */}
      <header className="tsm-topbar">
        <div className="tsm-topbar__inner">
          <a className="tsm-brand" href="/">
            Test Strip Marketplace
          </a>

          <nav className="tsm-nav">
            <a className="tsm-nav__link" href="/directory">
              Directory
            </a>
            <a className="tsm-nav__link" href="/marketplace">
              Marketplace
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="tsm-hero">
        <div className="tsm-hero__inner">
          <h1 className="tsm-hero__title">Find buyers near you — or nationwide.</h1>
          <p className="tsm-hero__subtitle">
            Search the buyer directory, or browse marketplace ads.
          </p>

          {/* Above-the-fold search */}
          <div className="tsm-search">
            <input
              className="tsm-search__input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buyers by city, ZIP, or state"
              aria-label="Search buyer directory"
            />
            <a className="tsm-search__button" href={directoryUrl}>
              Search
            </a>
          </div>

          {/* Primary CTAs */}
          <div className="tsm-ctaRow">
            <a className="tsm-cta tsm-cta--primary" href={directoryUrl}>
              Browse Directory
            </a>
            <a className="tsm-cta tsm-cta--secondary" href="/marketplace">
              Browse Marketplace Ads
            </a>
          </div>

          {/* Small trust row (Yelp/Zillow vibe) */}
          <div className="tsm-trustRow">
            <div className="tsm-pill">Public listings</div>
            <div className="tsm-pill">Claimable profiles</div>
            <div className="tsm-pill">Local pickup or shipping</div>
          </div>

          <div className="tsm-legalLinks">
            <a href="/terms">Terms</a>
            <span className="tsm-dot">•</span>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
