import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let numValue;
    
    if (name.includes('Rating')) {
      numValue = parseInt(value);
    } else if (name === 'lat' || name === 'lng') {
      numValue = parseFloat(value);
    } else {
      numValue = parseFloat(value);
    }
    
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
      lat: null,
      lng: null,
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
            value={localFilters.minRating || 1}
            onChange={handleChange}
          />
          <span>{localFilters.minRating || 1} ★</span>
        </div>
        
        <div className="filter-control">
          <label htmlFor="maxRating">Maximum Rating</label>
          <input
            type="range"
            id="maxRating"
            name="maxRating"
            min="1"
            max="5"
            value={localFilters.maxRating || 5}
            onChange={handleChange}
          />
          <span>{localFilters.maxRating || 5} ★</span>
        </div>
        
        <div className="filter-control">
          <label htmlFor="lat">Latitude</label>
          <input
            type="number"
            id="lat"
            name="lat"
            value={localFilters.lat || ''}
            onChange={handleChange}
            placeholder="e.g., 19.076"
            step="any"
          />
        </div>
        
        <div className="filter-control">
          <label htmlFor="lng">Longitude</label>
          <input
            type="number"
            id="lng"
            name="lng"
            value={localFilters.lng || ''}
            onChange={handleChange}
            placeholder="e.g., 72.877"
            step="any"
          />
        </div>
        
        <div className="filter-control">
          <label htmlFor="proximityRadius">Proximity Radius (km)</label>
          <input
            type="range"
            id="proximityRadius"
            name="proximityRadius"
            min="1"
            max="50"
            value={localFilters.proximityRadius || 10}
            onChange={handleChange}
          />
          <span>{localFilters.proximityRadius || 10} km</span>
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