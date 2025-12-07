// src/components/FiltersSidebar.tsx
import React from "react";
import type { AdFilters } from "../types";

interface FiltersSidebarProps {
  filters: AdFilters;
  onFiltersChange: (next: AdFilters) => void;
  onReset: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleChange = (patch: Partial<AdFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  return (
    <aside className="tsm-filters">
      <h3 className="tsm-filters-title">Filters</h3>

      {/* ZIP + Nationwide (stacked) – still cosmetic for now */}
      <div className="tsm-filter-group">
        <label className="tsm-label">My ZIP (optional)</label>
        <div className="tsm-zip-group">
          <input
            className="tsm-input"
            placeholder="e.g., 30301"
            value={filters.zip}
            onChange={(e) => handleChange({ zip: e.target.value })}
          />
          <select
            className="tsm-select"
            value="Nationwide"
            disabled // ⬅️ changed from readOnly to disabled
          >
            <option>Nationwide</option>
          </select>
        </div>
        <p className="tsm-help-text">
          No ZIP set — showing the latest nationwide ads.
        </p>
      </div>

      {/* Search */}
      <div className="tsm-filter-group">
        <label className="tsm-label">Search</label>
        <input
          className="tsm-input"
          placeholder="Search titles or notes..."
          value={filters.search}
          onChange={(e) => handleChange({ search: e.target.value })}
        />
      </div>

      {/* Category */}
      <div className="tsm-filter-group">
        <label className="tsm-label">Category</label>

        <label className="tsm-checkbox-row">
          <input
            type="checkbox"
            checked={filters.categoryDevices}
            onChange={(e) =>
              handleChange({ categoryDevices: e.target.checked })
            }
          />{" "}
          Devices
        </label>

        <label className="tsm-checkbox-row">
          <input
            type="checkbox"
            checked={filters.categorySupplies}
            onChange={(e) =>
              handleChange({ categorySupplies: e.target.checked })
            }
          />{" "}
          Supplies
        </label>

        <label className="tsm-checkbox-row">
          <input
            type="checkbox"
            checked={filters.categoryTestStrips}
            onChange={(e) =>
              handleChange({ categoryTestStrips: e.target.checked })
            }
          />{" "}
          Test Strips
        </label>
      </div>

      {/* Buyer offer: Min / Max inline with $ prefix */}
      <div className="tsm-filter-group">
        <label className="tsm-label">Buyer offer ($)</label>

        <div className="tsm-range-inline tsm-range-inline-compact">
          <div className="tsm-input-with-prefix">
            <span className="tsm-input-prefix">$</span>
            <input
              className="tsm-input"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => handleChange({ priceMin: e.target.value })}
            />
          </div>

          <div className="tsm-input-with-prefix">
            <span className="tsm-input-prefix">$</span>
            <input
              className="tsm-input"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => handleChange({ priceMax: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="tsm-filter-group">
        <label className="tsm-label">Sort by</label>
        <select
          className="tsm-select"
          value={filters.sortBy}
          onChange={(e) =>
            handleChange({
              sortBy: e.target.value === "highest" ? "highest" : "newest",
            })
          }
        >
          <option value="newest">Newest</option>
          <option value="highest">Highest offers</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="tsm-filter-actions">
        {/* Filters apply instantly when changed; Apply is a no-op for now */}
        <button
          className="tsm-btn-primary"
          type="button"
          disabled
          style={{ opacity: 0.6, cursor: "default" }}
        >
          Apply
        </button>
        <button
          className="tsm-btn-ghost"
          type="button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
