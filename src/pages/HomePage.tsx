// src/pages/HomePage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const directoryUrl = useMemo(() => {
    const q = query.trim();
    return q ? `/directory?q=${encodeURIComponent(q)}` : "/directory";
  }, [query]);

  return (
    <div className="tsm-app">
      <Header
        navMode="site"
        siteActive={null}
        activeTab="home"
        onTabChange={() => {}}
        onPostClick={() => navigate("/marketplace")}
        onAccountClick={() => navigate("/marketplace")}
        userEmail={null}
        loading={false}
        isGuest={true}
        userRole={null}
        postingRole="seller"
        onPostingRoleChange={() => {}}
      />

      {/* ✅ NOT using .tsm-main (grid) so we don't get sidebar spacing */}
      <main className="tsm-home-main">
        <section className="tsm-home-card">
          <h1 className="tsm-home-title">
            Find buyers near you — or nationwide.
          </h1>
          <p className="tsm-home-subtitle">
            Search the buyer directory, or browse marketplace ads.
          </p>

          <div className="tsm-home-search">
            <input
              className="tsm-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buyers by city, ZIP, or state"
              aria-label="Search buyer directory"
            />
            <a
              className="tsm-btn-primary tsm-home-search-btn"
              href={directoryUrl}
            >
              Search
            </a>
          </div>

          <div className="tsm-home-ctas">
            <a className="tsm-btn-primary tsm-home-cta" href={directoryUrl}>
              Browse Directory
            </a>
            <a className="tsm-btn-ghost tsm-home-cta" href="/marketplace">
              Browse Marketplace Ads
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
