import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../restAPI/api';
import './PortFolioDetails.css';

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'];
const getAvatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const PortFolioDetails = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/portfolios/${id}`);
        setPortfolio(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Portfolio not found or server error');
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  if (loading) return (
    <div className="pf-details-loading">
      <div className="pf-details-loading__spinner" />
      <p>Loading portfolio…</p>
    </div>
  );

  if (error) return (
    <div className="error-state" style={{ minHeight: '60vh' }}>
      <div className="error-state__icon">⚠️</div>
      <p className="error-state__title">Portfolio Not Found</p>
      <p className="error-state__text">{error}</p>
      <Link to="/portfolios" className="btn btn-primary">Back to Portfolios</Link>
    </div>
  );

  const skills = portfolio.skills
    ? portfolio.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const certifications = portfolio.certifications
    ? portfolio.certifications.split(',').map(c => c.trim()).filter(Boolean)
    : [];
  const languages = portfolio.languages
    ? portfolio.languages.split(',').map(l => l.trim()).filter(Boolean)
    : [];

  return (
    <div className="pf-details-page">
      {/* Hero Banner */}
      <div className="pf-details-hero">
        <div className="container">
          <Link to="/portfolios" className="pf-details-back">← Back to Portfolios</Link>
        </div>
      </div>

      <div className="container pf-details-layout">
        {/* Sidebar */}
        <aside className="pf-details-sidebar">
          {/* Profile Card */}
          <div className="pf-details-profile-card card">
            <div className="pf-details-avatar-wrap">
              {portfolio.profile_image_url ? (
                <img
                  src={portfolio.profile_image_url}
                  alt={portfolio.full_name}
                  className="pf-details-avatar-img"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="pf-details-avatar-placeholder" style={{ backgroundColor: getAvatarColor(portfolio.full_name) }}>
                  {portfolio.full_name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
              )}
            </div>
            <h1 className="pf-details-name">{portfolio.full_name}</h1>
            <p className="pf-details-title">{portfolio.profession_title}</p>
            <p className="pf-details-location">📍 {portfolio.location}</p>

            {portfolio.availability && (
              <span className="badge badge-success pf-details-availability">{portfolio.availability}</span>
            )}

            {portfolio.experience_years && (
              <div className="pf-details-exp-badge">
                <span className="pf-details-exp-num">{portfolio.experience_years}</span>
                <span className="pf-details-exp-label">Years Experience</span>
              </div>
            )}

            <div className="pf-details-contact">
              {portfolio.email && (
                <a href={`mailto:${portfolio.email}`} className="pf-details-contact-item">
                  <span className="pf-details-contact-icon">✉️</span>
                  <span>{portfolio.email}</span>
                </a>
              )}
              {portfolio.phone && (
                <a href={`tel:${portfolio.phone}`} className="pf-details-contact-item">
                  <span className="pf-details-contact-icon">📞</span>
                  <span>{portfolio.phone}</span>
                </a>
              )}
              {portfolio.portfolio_url && (
                <a href={portfolio.portfolio_url} target="_blank" rel="noopener noreferrer" className="pf-details-contact-item pf-details-contact-link">
                  <span className="pf-details-contact-icon">🔗</span>
                  <span>View Portfolio</span>
                </a>
              )}
            </div>
          </div>

          {/* Skills Card */}
          {skills.length > 0 && (
            <div className="card pf-details-section-card">
              <h3 className="pf-details-section-title">Skills</h3>
              <div className="pf-details-skills">
                {skills.map((s, i) => (
                  <span key={i} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="card pf-details-section-card">
              <h3 className="pf-details-section-title">Certifications</h3>
              <ul className="pf-details-cert-list">
                {certifications.map((c, i) => (
                  <li key={i} className="pf-details-cert-item">
                    <span className="pf-details-cert-icon">🏅</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="card pf-details-section-card">
              <h3 className="pf-details-section-title">Languages</h3>
              <div className="pf-details-langs">
                {languages.map((l, i) => (
                  <span key={i} className="chip">{l}</span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="pf-details-main">
          {/* About */}
          <div className="card pf-details-section-card">
            <h2 className="pf-details-section-title">About Me</h2>
            <p className="pf-details-about-text">
              {portfolio.about_me || 'No description available.'}
            </p>
          </div>

          {/* Quick Info */}
          <div className="card pf-details-section-card">
            <h2 className="pf-details-section-title">Professional Info</h2>
            <div className="pf-details-info-grid">
              <div className="pf-details-info-item">
                <span className="pf-details-info-label">Experience</span>
                <span className="pf-details-info-value">
                  {portfolio.experience_years ? `${portfolio.experience_years} years` : 'N/A'}
                </span>
              </div>
              <div className="pf-details-info-item">
                <span className="pf-details-info-label">Availability</span>
                <span className="pf-details-info-value">{portfolio.availability || 'N/A'}</span>
              </div>
              <div className="pf-details-info-item">
                <span className="pf-details-info-label">Location</span>
                <span className="pf-details-info-value">{portfolio.location || 'N/A'}</span>
              </div>
              <div className="pf-details-info-item">
                <span className="pf-details-info-label">Profile Since</span>
                <span className="pf-details-info-value">
                  {new Date(portfolio.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortFolioDetails;