import React, { useEffect, useState, useCallback } from 'react';
import api from '../../restAPI/api';
import { Link } from 'react-router-dom';
import './Jobs.css';
import debounce from 'lodash/debounce';
import JobFilters from './JobFilters';

/**
 * JobsList Component - Modern Redesign
 * 
 * Features:
 * - Modern glassmorphism UI design
 * - Advanced filtering with smooth animations
 * - Responsive grid layout
 * - Real-time search with debouncing
 * - Loading skeletons for better UX
 * - Infinite scroll / load more functionality
 * - Filter chips with individual removal
 * - Salary range slider
 * - Remote work toggle
 * 
 * Maintenance Notes:
 * - API endpoint should be moved to environment variables
 * - Consider implementing virtual scrolling for large datasets
 * - Add unit tests for filter logic
 * - Implement error boundary for production
 */
const JobsList = () => {
    // State management
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(9);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        jobTypes: [],
        categories: [],
        experienceLevels: [],
        remoteOnly: false,
        datePosted: 'all'
    });

    // Debounced API call
    const debouncedFetchJobs = useCallback(
        debounce(async (filters) => {
            try {
                setLoading(true);
                const response = await api.get("/job_postings", {
                    params: {
                        search: filters.search || undefined,
                        jobTypes: filters.jobTypes.length ? filters.jobTypes.join(',') : undefined,
                        categories: filters.categories.length ? filters.categories.join(',') : undefined,
                        experienceLevels: filters.experienceLevels.length ? filters.experienceLevels.join(',') : undefined,
                        remote: filters.remoteOnly || undefined,
                        datePosted: filters.datePosted !== 'all' ? filters.datePosted : undefined,
                    }
                });
                
                // Defensive state update: Always ensure an array is set
                // Alignment with backend format: { success, data: [] }
                setJobs(response.data || []);
                setError(null);
                setVisibleCount(9);
            } catch (err) {
                // Mandatory global error handling and state reset
                setError("Failed to fetch jobs");
                setJobs([]);
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    // Fetch jobs on filter change
    useEffect(() => {
        debouncedFetchJobs(filters);
        return () => debouncedFetchJobs.cancel();
    }, [filters, debouncedFetchJobs]);

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            search: '',
            jobTypes: [],
            categories: [],
            experienceLevels: [],
            remoteOnly: false,
            datePosted: 'all'
        });
    };

    // Mandatory Loading UI (Standardized)
    if (loading && (!jobs || jobs.length === 0)) {
        return (
            <div className="jobs-page loading-state">
                <div className="jobs-header">
                    <h1 className="page-title">Loading Jobs...</h1>
                </div>
                <div className="jobs-grid skeleton-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="job-card skeleton">
                            <div className="skeleton-header"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <div className="error-message">{error}</div>
                <button 
                    onClick={() => debouncedFetchJobs(filters)}
                    className="btn-retry"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="jobs-page">
            {/* Hero Section */}
            <div className="jobs-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Find Your <span className="gradient-text">Perfect Match</span>
                    </h1>
                    <p className="hero-subtitle">
                        Browse through thousands of job opportunities tailored to your skills
                    </p>
                    <div className="hero-search">
                        <input
                            type="text"
                            placeholder="Search jobs by title, company, or keyword..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="hero-search-input"
                        />
                        <button 
                            className="btn-filter-toggle"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M2 5H18M5 10H15M8 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
                                <circle cx="5" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
                                <circle cx="12" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="jobs-container">
                {/* Filters Sidebar */}
                <aside className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
                    <div className="filters-header">
                        <h3>Filters</h3>
                        {(
                            filters.search !== '' ||
                            filters.jobTypes.length > 0 ||
                            filters.categories.length > 0 ||
                            filters.experienceLevels.length > 0 ||
                            filters.remoteOnly ||
                            filters.datePosted !== 'all'
                        ) && (
                            <button onClick={clearAllFilters} className="btn-clear-all">
                                Clear All
                            </button>
                        )}
                    </div>
                    
                    <JobFilters 
                        filters={filters} 
                        setFilters={setFilters} 
                        clearAllFilters={clearAllFilters}
                        resultCount={jobs.length}
                        hasSearch={filters.search.length > 0}
                    />
                </aside>

                {/* Jobs Grid */}
                <main className="jobs-main">
                    {/* Results Header */}
                    <div className="results-header">
                        <div className="results-count">
                            <span className="count-number">{jobs.length}</span>
                            <span className="count-text">jobs found</span>
                        </div>
                        <div className="results-actions">
                            <select 
                                className="sort-select"
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="salary-high">Highest Salary</option>
                                <option value="salary-low">Lowest Salary</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    <SelectedFiltersSummary 
                        filters={filters} 
                        setFilters={setFilters} 
                        clearAllFilters={clearAllFilters} 
                    />

                    {/* Jobs Grid with Mandatory Defensive Rendering */}
                    <div className="jobs-grid">
                        {Array.isArray(jobs) && jobs.length > 0 ? (
                            <>
                                {jobs.slice(0, visibleCount).map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                                
                                {visibleCount < jobs.length && (
                                    <div className="load-more-container">
                                        <button 
                                            onClick={() => setVisibleCount(prev => prev + 9)} 
                                            className="btn-load-more"
                                        >
                                            Load More Jobs
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Fallback UI for No Data
                            <div className="no-jobs">
                                <div className="no-jobs-icon">🔍</div>
                                <h3>No jobs found</h3>
                                <p>We couldn't find any jobs matching your criteria</p>
                                <button 
                                    onClick={clearAllFilters}
                                    className="btn-clear"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

const SelectedFiltersSummary = ({ filters, setFilters, clearAllFilters }) => {
    const activeFilters = [];
    
    if (filters.search) activeFilters.push({ 
        label: `"${filters.search}"`, 
        key: 'search', 
        val: '' 
    });
    
    filters.jobTypes.forEach(val => activeFilters.push({ 
        label: val, 
        key: 'jobTypes', 
        val 
    }));
    
    filters.categories.forEach(val => activeFilters.push({ 
        label: val, 
        key: 'categories', 
        val 
    }));
    
    filters.experienceLevels.forEach(val => activeFilters.push({ 
        label: val, 
        key: 'experienceLevels', 
        val 
    }));
    
    if (filters.remoteOnly) activeFilters.push({ 
        label: 'Remote Only', 
        key: 'remoteOnly', 
        val: false 
    });
    
    if (filters.datePosted !== 'all') {
        const dateLabels = {
            today: 'Today',
            week: 'Last 7 days',
            month: 'Last 30 days'
        };
        activeFilters.push({ 
            label: dateLabels[filters.datePosted], 
            key: 'datePosted', 
            val: 'all' 
        });
    }

    if (activeFilters.length === 0) return null;

    const removeFilter = (item) => {
        setFilters(prev => {
            if (Array.isArray(prev[item.key])) {
                return { ...prev, [item.key]: prev[item.key].filter(v => v !== item.val) };
            }
            return { ...prev, [item.key]: item.val };
        });
    };

    return (
        <div className="selected-filters-summary">
            <div className="summary-header">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span className="summary-title">Active Filters</span>
            </div>
            <div className="summary-tags">
                {activeFilters.map((item, idx) => (
                    <span key={idx} className="summary-tag">
                        {item.label}
                        <button 
                            className="tag-remove" 
                            onClick={() => removeFilter(item)} 
                            aria-label={`Remove filter ${item.label}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
                {activeFilters.length > 1 && (
                    <button className="btn-clear-tags" onClick={clearAllFilters}>
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
};

const JobCard = ({ job }) => {
    const getJobTypeColor = (type) => {
        const colors = {
            'full-time': 'success',
            'part-time': 'warning',
            'contract': 'info',
            'internship': 'secondary',
            'remote': 'primary'
        };
        return colors[type.toLowerCase()] || 'default';
    };

    return (
        <div className="job-card">
            <div className="job-card-inner">
                <div className="job-card-header">
                    <div className="company-avatar">
                        {job.company_name?.charAt(0) || 'C'}
                    </div>
                    <div className="job-title-container">
                        <h3 className="job-title">{job.advert_title}</h3>
                        <p className="company-name">{job.company_name}</p>
                    </div>
                </div>
                
                <div className="job-meta">
                    <span className="meta-item location">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 7.875C8.103 7.875 9 6.978 9 5.875C9 4.772 8.103 3.875 7 3.875C5.897 3.875 5 4.772 5 5.875C5 6.978 5.897 7.875 7 7.875Z" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M11 5.875C11 9.125 7 12.875 7 12.875C7 12.875 3 9.125 3 5.875C3 3.663 4.79 1.875 7 1.875C9.21 1.875 11 3.663 11 5.875Z" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                        {job.is_remote ? 'Remote' : job.location}
                    </span>
                    <span className={`job-type-badge ${getJobTypeColor(job.job_type)}`}>
                        {job.job_type}
                    </span>
                </div>
                
                <p className="job-description">
                    {job.description.substring(0, 120)}...
                </p>
                
                <div className="job-footer">
                    <span className="post-date">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M9 1.5H3C2.172 1.5 1.5 2.172 1.5 3V9C1.5 9.828 2.172 10.5 3 10.5H9C9.828 10.5 10.5 9.828 10.5 9V3C10.5 2.172 9.828 1.5 9 1.5Z" stroke="currentColor" strokeWidth="1"/>
                            <path d="M8 0.75V2.25M4 0.75V2.25M1.5 4.5H10.5" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                        {new Date(job.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                    <Link 
                        to={`/jobs/${job.id}`} 
                        className="btn-apply"
                    >
                        View Details
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M4.5 1.5L10.5 7L4.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobsList;