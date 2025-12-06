// src/components/FiltersSidebar.tsx
import React from "react";

const FiltersSidebar: React.FC = () => {
  return (
    <aside className="tsm-filters">
      <h3 className="tsm-filters-title">Filters</h3>

      {/* ZIP + Nationwide (stacked) */}
      <div className="tsm-filter-group">
        <label className="tsm-label">My ZIP (optional)</label>
        <div className="tsm-zip-group">
          <input className="tsm-input" placeholder="e.g., 30301" />
          <select className="tsm-select">
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
        />
      </div>

      {/* Category */}
      <div className="tsm-filter-group">
        <label className="tsm-label">Category</label>
        <label className="tsm-checkbox-row">
          <input type="checkbox" defaultChecked /> Devices
        </label>
        <label className="tsm-checkbox-row">
          <input type="checkbox" defaultChecked /> Supplies
        </label>
        <label className="tsm-checkbox-row">
          <input type="checkbox" defaultChecked /> Test Strips
        </label>
      </div>

      {/* Buyer offer: Min / Max inline with $ prefix */}
      <div className="tsm-filter-group">
        <label className="tsm-label">Buyer offer ($)</label>

        <div className="tsm-range-inline tsm-range-inline-compact">
          <div className="tsm-input-with-prefix">
            <span className="tsm-input-prefix">$</span>
            <input className="tsm-input" placeholder="Min" />
          </div>

          <div className="tsm-input-with-prefix">
            <span className="tsm-input-prefix">$</span>
            <input className="tsm-input" placeholder="Max" />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="tsm-filter-group">
        <label className="tsm-label">Sort by</label>
        <select className="tsm-select">
          <option>Newest</option>
          <option>Highest offers</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="tsm-filter-actions">
        <button className="tsm-btn-primary">Apply</button>
        <button className="tsm-btn-ghost">Reset</button>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
