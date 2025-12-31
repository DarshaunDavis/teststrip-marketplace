// src/components/DirectoryFiltersSidebar.tsx
import React from "react";
import type { DirectoryFilters } from "../types";

interface DirectoryFiltersSidebarProps {
  filters: DirectoryFilters;
  onFiltersChange: (next: DirectoryFilters) => void;
  onReset: () => void;
}

const DirectoryFiltersSidebar: React.FC<DirectoryFiltersSidebarProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  return (
    <aside className="tsm-filters">
      <h2 className="tsm-filters-title">Filters</h2>

      <div className="tsm-filter-group">
        <label className="tsm-label">ZIP Code</label>
        <div className="tsm-zip-group">
          <input
            className="tsm-input"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 10458"
            value={filters.zip}
            onChange={(e) =>
              onFiltersChange({ ...filters, zip: e.target.value })
            }
          />
          <p className="tsm-help-text">
            Match buyers near a specific ZIP.
          </p>
        </div>
      </div>

      <div className="tsm-filter-group">
        <label className="tsm-label">Search</label>
        <input
          className="tsm-input"
          type="text"
          placeholder="Search buyer name or note…"
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
        />
      </div>

      <div className="tsm-filter-group">
        <label className="tsm-label">Fulfillment</label>
        <select
          className="tsm-select"
          value={filters.fulfillment}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              fulfillment: e.target.value as DirectoryFilters["fulfillment"],
            })
          }
        >
          <option value="any">Pickup or Shipping</option>
          <option value="pickup">Pickup only</option>
          <option value="ship">Shipping only</option>
        </select>
        <p className="tsm-help-text">
          Sellers can choose buyers that meet their preference.
        </p>
      </div>

      <div className="tsm-filter-group">
        <label className="tsm-label">Sort</label>
        <select
          className="tsm-select"
          value={filters.sortBy}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              sortBy: e.target.value as DirectoryFilters["sortBy"],
            })
          }
        >
          <option value="newest">Newest</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>

      <div className="tsm-filter-actions">
        <button className="tsm-btn-primary" type="button">
          Apply
        </button>
        <button className="tsm-btn-ghost" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </aside>
  );
};

export default DirectoryFiltersSidebar;
