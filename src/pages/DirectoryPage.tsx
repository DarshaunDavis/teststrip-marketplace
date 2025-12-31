// src/pages/DirectoryPage.tsx
import React, { useMemo, useState } from "react";

import { useAuth } from "../authContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

import DirectoryFiltersSidebar from "../components/DirectoryFiltersSidebar";
import DirectoryFeed from "../components/DirectoryFeed";
import DirectoryBuyerModal from "../components/DirectoryBuyerModal";
import { useDirectoryBuyers } from "../hooks/useDirectoryBuyers";

import type { DirectoryBuyer, DirectoryFilters } from "../types";

const DEFAULT_FILTERS: DirectoryFilters = {
  zip: "",
  search: "",
  fulfillment: "any",
  sortBy: "newest",
};

function applyDirectoryFilters(buyers: DirectoryBuyer[], filters: DirectoryFilters) {
  let result = [...buyers];

  // ZIP (exact 5 digits)
  const zipTrim = filters.zip.trim();
  if (zipTrim && /^\d{5}$/.test(zipTrim)) {
    result = result.filter((b) => (b.zip ?? "").trim() === zipTrim);
  }

  // Search (buyerName + note + city/state)
  const q = filters.search.trim().toLowerCase();
  if (q) {
    result = result.filter((b) => {
      const a = (b.buyerName ?? "").toLowerCase();
      const n = (b.note ?? "").toLowerCase();
      const c = (b.city ?? "").toLowerCase();
      const s = (b.state ?? "").toLowerCase();
      return a.includes(q) || n.includes(q) || c.includes(q) || s.includes(q);
    });
  }

  // Fulfillment
  if (filters.fulfillment === "pickup") {
    result = result.filter((b) => b.fulfillment === "pickup" || b.fulfillment === "both");
  } else if (filters.fulfillment === "ship") {
    result = result.filter((b) => b.fulfillment === "ship" || b.fulfillment === "both");
  }

  // Sort
  if (filters.sortBy === "name") {
    result.sort((a, b) => (a.buyerName ?? "").localeCompare(b.buyerName ?? ""));
  } else {
    result.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }

  // Keep sponsored at top of their own strip; don’t disrupt the strip logic,
  // but keep overall stable ordering for modal indexing.
  return result;
}

const DirectoryPage: React.FC = () => {
  const { user, loading, role } = useAuth();
  const isGuest = !user;

  const { buyers } = useDirectoryBuyers();

  const [filters, setFilters] = useState<DirectoryFilters>(DEFAULT_FILTERS);

  const filteredBuyers = useMemo(() => {
    return applyDirectoryFilters(buyers, filters);
  }, [buyers, filters]);

  const [selectedBuyerIndex, setSelectedBuyerIndex] = useState<number | null>(null);

  const selectedBuyer =
    selectedBuyerIndex !== null ? filteredBuyers[selectedBuyerIndex] : null;

  const handleResetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="tsm-app">
      <Header
        navMode="site"
        siteActive="directory"
        userEmail={user?.email ?? null}
        loading={loading}
        isGuest={isGuest}
        userRole={role}
      />

      <main className="tsm-main">
        <DirectoryFiltersSidebar
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
        />

        <div className="tsm-feed-column">
          <DirectoryFeed
            buyers={filteredBuyers}
            onBuyerClick={(index) => setSelectedBuyerIndex(index)}
          />
        </div>
      </main>

      {selectedBuyer && (
        <DirectoryBuyerModal
          buyer={selectedBuyer}
          onClose={() => setSelectedBuyerIndex(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default DirectoryPage;
