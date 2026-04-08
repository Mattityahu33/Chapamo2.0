import React, { useState, useEffect } from 'react';
import api from '../../restAPI/api';
import { Link } from 'react-router-dom';
import './PortFolios.css';

const PortFolioSkeleton = () => (
  <div className="portfolio-card portfolio-card--skeleton">
    <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px' }} />
    <div className="skeleton" style={{ height: 16, width: '70%', margin: '0 auto 8px' }} />
    <div className="skeleton" style={{ height: 12, width: '50%', margin: '0 auto 8px' }} />
    <div className="skeleton" style={{ height: 12, width: '40%', margin: '0 auto 16px' }} />
    <div className="skeleton" style={{ height: 36, borderRadius: 20 }} />
  </div>
);

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'];
const getAvatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const PortFolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const res = await api.get('/portfolios');
        const data = res.data || [];
        setPortfolios(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch portfolios. Please try again later.');
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  return (
    <div className="portfolios-page">
      {/* Page Header */}
      <div className="portfolios-hero">
        <div className="container">
          <span className="section-header__eyebrow">Talent Showcase</span>
          <h1 className="portfolios-hero__title">Discover Top Professionals</h1>
          <p className="portfolios-hero__subtitle">
            Browse portfolios from Zambia's most talented professionals.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Results bar */}
        {!loading && !error && (
          <div className="portfolios-results-bar">
            <span className="portfolios-results-count">
              <strong>{portfolios.length}</strong> professionals found
            </span>
          </div>
        )}

        {/* Grid */}
        {error ? (
          <div className="error-state">
            <div className="error-state__icon">⚠️</div>
            <p className="error-state__title">Something went wrong</p>
            <p className="error-state__text">{error}</p>
          </div>
        ) : (
          <div className="portfolios-grid">
            {loading
              ? [...Array(8)].map((_, i) => <PortFolioSkeleton key={i} />)
              : portfolios.length === 0
                ? (
                  <div className="empty-state">
                    <div className="empty-state__icon">👤</div>
                    <p className="empty-state__title">No portfolios yet</p>
                    <p className="empty-state__text">Be the first to create a portfolio and showcase your skills.</p>
                    <Link to="/create" className="btn btn-primary">Create Portfolio</Link>
                  </div>
                )
                : portfolios.map(portfolio => (
                    <div key={portfolio.id} className="portfolio-card">
                      {portfolio.profile_image_url ? (
                        <img
                          src={portfolio.profile_image_url}
                          alt={`${portfolio.full_name}'s profile`}
                          className="portfolio-card__img"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="portfolio-card__avatar"
                          style={{ backgroundColor: getAvatarColor(portfolio.full_name) }}
                        >
                          {portfolio.full_name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                      )}
                      <h3 className="portfolio-card__name">{portfolio.full_name}</h3>
                      <p className="portfolio-card__profession">{portfolio.profession_title}</p>
                      <p className="portfolio-card__location">📍 {portfolio.location}</p>
                      {portfolio.availability && (
                        <span className="badge badge-success portfolio-card__availability">
                          {portfolio.availability}
                        </span>
                      )}
                      {portfolio.skills && (
                        <div className="portfolio-card__skills">
                          {portfolio.skills.split(',').slice(0, 3).map((s, i) => (
                            <span key={i} className="chip">{s.trim()}</span>
                          ))}
                        </div>
                      )}
                      <Link to={`/portfolios/${portfolio.id}`} className="portfolio-card__btn btn btn-outline btn-sm">
                        View Profile
                      </Link>
                    </div>
                  ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default PortFolios;