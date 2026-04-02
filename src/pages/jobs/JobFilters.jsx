import React, { useState } from 'react';
import './JobFilters.css';
import { JOB_TYPE_OPTIONS, CATEGORY_OPTIONS, EXPERIENCE_LEVEL_OPTIONS } from './constants';

const JobFilters = ({ filters, setFilters, clearAllFilters, resultCount, hasSearch }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Derived active count for mobile badge
  const activeCount = 
    (filters.search ? 1 : 0) +
    filters.jobTypes.length +
    filters.categories.length +
    filters.experienceLevels.length +
    (filters.remoteOnly ? 1 : 0);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCheckboxChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = [...prev[filterType]];
      const index = currentValues.indexOf(value);
      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }
      return { ...prev, [filterType]: currentValues };
    });
  };



  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-filter-toggle" 
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open Filters"
      >
        <span className="filter-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </span>
        Filters
        {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`filter-overlay ${isMobileOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      ></div>

      <div className={`filters-container ${isMobileOpen ? 'open' : ''}`}>
        <div className="filters-header-mobile">
          <h2>Filters</h2>
          <button 
            className="close-filters-btn" 
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close Filters"
          >
            ×
          </button>
        </div>

        <div className="filters-content">
          {/* Search Box */}
          <div className="filter-group block-search">
            <div className="search-input-wrapper">
              <svg className="search-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={filters.search}
                onChange={handleSearchChange}
                className="filter-search-input"
                aria-label="Search jobs"
              />
            </div>
            {hasSearch && (
              <div className="results-count-text">
                {resultCount} {resultCount === 1 ? 'result' : 'results'} found
              </div>
            )}
          </div>

          <div className="filters-scroll-area">
            {/* Job Type */}
            <fieldset className="filter-group">
              <legend className="filter-title">Job Type</legend>
              <div className="filter-options-grid">
                {JOB_TYPE_OPTIONS.map(type => {
                  const isActive = filters.jobTypes.includes(type);
                  return (
                    <label 
                      key={type} 
                      className={`custom-checkbox-btn ${isActive ? 'active' : ''}`}
                      tabIndex="0"
                      onKeyDown={(e) => { if(e.key === 'Enter') handleCheckboxChange('jobTypes', type) }}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={isActive}
                        onChange={() => handleCheckboxChange('jobTypes', type)}
                        aria-label={`Filter by ${type}`}
                      />
                      {type}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Category */}
            <fieldset className="filter-group">
              <legend className="filter-title">Category</legend>
              <div className="filter-options-grid">
                {CATEGORY_OPTIONS.map(category => {
                  const isActive = filters.categories.includes(category);
                  return (
                    <label 
                      key={category} 
                      className={`custom-checkbox-btn ${isActive ? 'active' : ''}`}
                      tabIndex="0"
                      onKeyDown={(e) => { if(e.key === 'Enter') handleCheckboxChange('categories', category) }}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={isActive}
                        onChange={() => handleCheckboxChange('categories', category)}
                        aria-label={`Filter by ${category}`}
                      />
                      {category}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Experience Level */}
            <fieldset className="filter-group">
              <legend className="filter-title">Experience Level</legend>
              <div className="filter-options-grid">
                {EXPERIENCE_LEVEL_OPTIONS.map(level => {
                  const isActive = filters.experienceLevels.includes(level);
                  return (
                    <label 
                      key={level} 
                      className={`custom-checkbox-btn ${isActive ? 'active' : ''}`}
                      tabIndex="0"
                      onKeyDown={(e) => { if(e.key === 'Enter') handleCheckboxChange('experienceLevels', level) }}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={isActive}
                        onChange={() => handleCheckboxChange('experienceLevels', level)}
                        aria-label={`Filter by ${level}`}
                      />
                      {level}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Remote Only */}
            <div className="filter-group">
              <label className="toggle-switch-wrapper">
                <div className="toggle-switch-left">
                  <span className="toggle-icon">🌍</span>
                  <span className="toggle-label-text">Remote Only</span>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={filters.remoteOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, remoteOnly: e.target.checked }))}
                    aria-label="Remote jobs only"
                  />
                  <span className="slider-round"></span>
                </div>
              </label>
            </div>
          </div>

          <div className="filters-footer">
            <button 
              className="btn-clear-filters" 
              onClick={clearAllFilters}
              disabled={activeCount === 0}
            >
              Clear All Filters
            </button>
            <button 
              className="btn-apply-mobile" 
              onClick={() => setIsMobileOpen(false)}
            >
              Show {resultCount} Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobFilters;
