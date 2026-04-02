// src/pages/SearchResults.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api/api';
import "./SearchResults.css"

const SearchResults = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const searchTerm = queryParams.get('search') || '';
  const locationTerm = queryParams.get('location') || '';
  const categoryTerm = queryParams.get('categories') || '';
  const industryTerm = queryParams.get('industry') || '';
  const jobTypeTerm = queryParams.get('jobType') || '';

  const [jobs, setJobs] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await api.get('/search', {
          params: {
            search: searchTerm,
            location: locationTerm,
            categories: categoryTerm,
            industry: industryTerm,
            jobType: jobTypeTerm,
            sort: sortBy
          },
        });

        setJobs(response.data.jobs || []);
        setPortfolios(response.data.portfolios || []);
      } catch (error) {
        console.error('Search fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm, locationTerm, categoryTerm, industryTerm, jobTypeTerm, sortBy]);

  const removeFilter = () => {
    // Implementation to remove a filter

  };

  const activeFilters = [
    searchTerm && { type: 'search', value: searchTerm },
    locationTerm && { type: 'location', value: locationTerm },
    categoryTerm && { type: 'category', value: categoryTerm },
    industryTerm && { type: 'industry', value: industryTerm },
    jobTypeTerm && { type: 'jobType', value: jobTypeTerm }
  ].filter(Boolean);

  if (loading) return <p>Loading search results...</p>;

  return (
    <div className="search-results-page">
      <h2>Search Results</h2>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="search-filters">
          <p>Active Filters:</p>
          <div className="filter-tags">
            {activeFilters.map((filter, index) => (
              <span key={index} className="filter-tag">
                {filter.type}: {filter.value}
                <button 
                  className="remove-filter"
                  onClick={() => removeFilter(filter.type)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="results-section">
        <div className="results-count">
          <h3>📄 Jobs ({jobs.length})</h3>
          <div className="sort-options">
            <label htmlFor="sort-jobs">Sort by:</label>
            <select 
              id="sort-jobs" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date Posted</option>
              <option value="salary">Salary</option>
            </select>
          </div>
        </div>
        
        {jobs.length === 0 ? (
          <p>No job results found. Try adjusting your search criteria.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="result-card job-card">
              <div className="job-header">
                <div>
                  <h4>{job.advert_title}</h4>
                  <p>{job.company_name} — {job.location}</p>
                </div>
                <div className="company-logo">
                  {job.company_name ? job.company_name.charAt(0) : 'C'}
                </div>
              </div>
              
              <div className="job-details">
                <span className="job-detail">
                  <i className="fas fa-briefcase"></i> {job.job_type}
                </span>
                {job.salary && (
                  <span className="job-detail salary-highlight">
                    <i className="fas fa-dollar-sign"></i> {job.salary}
                  </span>
                )}
                {job.experience_level && (
                  <span className="job-detail">
                    <i className="fas fa-chart-line"></i> {job.experience_level}
                  </span>
                )}
              </div>
              
              <p>{job.description?.slice(0, 120)}...</p>
              <Link to={`/jobs/${job.id}`} className="view-more-btn">View Job Details</Link>
            </div>
          ))
        )}
      </section>

      <section className="results-section">
        <div className="results-count">
          <h3>👤 Portfolios ({portfolios.length})</h3>
        </div>
        
        {portfolios.length === 0 ? (
          <p>No portfolio results found. Try adjusting your search criteria.</p>
        ) : (
          portfolios.map((portfolio) => (
            <div key={portfolio.id} className="result-card portfolio-card">
              <h4>{portfolio.full_name}</h4>
              <p>{portfolio.profession_title} — {portfolio.location}</p>
              
              {portfolio.skills && (
                <div className="skills">
                  {portfolio.skills.split(',').slice(0, 5).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.trim()}</span>
                  ))}
                </div>
              )}
              
              <p>{portfolio.about_me?.slice(0, 120)}...</p>
              <Link to={`/portfolios/${portfolio.id}`} className="view-more-btn">View Portfolio</Link>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default SearchResults;