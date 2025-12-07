// src/components/FiltersSidebar.tsx
import React, { useState } from "react";
import type { AdFilters } from "../types";
import { rtdb } from "../firebase";
import { ref as rtdbRef, get } from "firebase/database";

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
  const [zipHelp, setZipHelp] = useState<string>(
    "No ZIP set — showing the latest nationwide ads."
  );
  const [zipLookupBusy, setZipLookupBusy] = useState(false);

  const handleChange = (patch: Partial<AdFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const handleZipChange = async (value: string) => {
    handleChange({ zip: value });

    const trimmed = value.trim();

    if (!trimmed) {
      setZipHelp("No ZIP set — showing the latest nationwide ads.");
      return;
    }

    // Only try lookup for 5-digit numeric ZIPs
    if (!/^\d{5}$/.test(trimmed)) {
      setZipHelp("Enter a 5-digit ZIP to narrow ads near you.");
      return;
    }

    try {
      setZipLookupBusy(true);
      const snap = await get(rtdbRef(rtdb, `zipcodes/${trimmed}`));

      if (snap.exists()) {
        const data = snap.val() as {
          city?: string;
          state?: string;
        };

        if (data?.city && data?.state) {
          setZipHelp(
            `Showing ads in or near ${data.city}, ${data.state} (${trimmed}).`
          );
        } else {
          setZipHelp(`Showing ads in or near ZIP ${trimmed}.`);
        }
      } else {
        setZipHelp(
          `ZIP ${trimmed} not found in our database — showing nationwide ads.`
        );
      }
    } catch (err) {
      console.error("[FiltersSidebar] ZIP lookup failed", err);
      setZipHelp("Trouble looking up ZIP — showing nationwide ads.");
    } finally {
      setZipLookupBusy(false);
    }
  };

  return (
    <aside className="tsm-filters">
      <h3 className="tsm-filters-title">Filters</h3>

      {/* ZIP + “Nationwide” label */}
      <div className="tsm-filter-group">
        <label className="tsm-label">My ZIP (optional)</label>
        <div className="tsm-zip-group">
          <input
            className="tsm-input"
            placeholder="e.g., 30301"
            value={filters.zip}
            onChange={(e) => void handleZipChange(e.target.value)}
          />
          <select className="tsm-select" value="Nationwide" disabled>
            <option>Nationwide</option>
          </select>
        </div>
        <p className="tsm-help-text">
          {zipLookupBusy ? "Looking up that ZIP..." : zipHelp}
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
        {/* Filters apply instantly; Apply stays a visual hint for now */}
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
