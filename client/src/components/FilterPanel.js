import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = name.includes('Rating') ? parseInt(value) : parseFloat(value);
    
    setLocalFilters(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      minRating: 1,
      maxRating: 5,
      proximityRadius: 10
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      
      <div className="filter-controls">
        <div className="filter-control">
          <label htmlFor="minRating">Minimum Rating</label>
          <input
            type="range"
            id="minRating"
            name="minRating"
            min="1"
            max="5"
            value={localFilters.minRating}
            onChange={handleChange}
          />
          <span>{localFilters.minRating} ★</span>
        </div>
        
        <div className="filter-control">
          <label htmlFor="maxRating">Maximum Rating</label>
          <input
            type="range"
            id="maxRating"
            name="maxRating"
            min="1"
            max="5"
            value={localFilters.maxRating}
            onChange={handleChange}
          />
          <span>{localFilters.maxRating} ★</span>
        </div>
        
        <div className="filter-control">
          <label htmlFor="proximityRadius">Proximity Radius (km)</label>
          <input
            type="range"
            id="proximityRadius"
            name="proximityRadius"
            min="1"
            max="50"
            value={localFilters.proximityRadius}
            onChange={handleChange}
          />
          <span>{localFilters.proximityRadius} km</span>
        </div>
      </div>
      
      <div className="filter-actions">
        <button onClick={handleApplyFilters} className="apply-filters-btn">Apply Filters</button>
        <button onClick={handleResetFilters} className="reset-filters-btn">Reset</button>
      </div>
    </div>
  );
};

export default FilterPanel;