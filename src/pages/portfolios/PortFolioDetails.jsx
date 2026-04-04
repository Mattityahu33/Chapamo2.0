import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../restAPI/api';
import './PortFolioDetails.css';

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

  if (loading) return <div className="loading">Loading portfolio...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="portfolio-details-container">
      <Link to="/portfolios" className="back-link">← Back to Portfolios</Link>
      
      <div className="portfolio-details-card">
        <div className="profile-section">
          <img
            src={portfolio.profile_image_url || '/default-profile.png'}
            alt={portfolio.full_name}
            className="profile-image-large"
            onError={(e) => {
              e.target.src = '/default-profile.png';
            }}
          />
          <div className="basic-info">
            <h2>{portfolio.full_name}</h2>
            <p className="profession-title">{portfolio.profession_title}</p>
            <p className="location">{portfolio.location}</p>
          </div>
        </div>

        <div className="details-section">
          <div className="details-column">
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{portfolio.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{portfolio.email || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Experience:</span>
              <span className="detail-value">
                {portfolio.experience_years ? `${portfolio.experience_years} years` : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Availability:</span>
              <span className="detail-value">{portfolio.availability || 'N/A'}</span>
            </div>
          </div>

          <div className="details-column">
            <div className="detail-item">
              <span className="detail-label">Skills:</span>
              <span className="detail-value">{portfolio.skills || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Certifications:</span>
              <span className="detail-value">{portfolio.certifications || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Languages:</span>
              <span className="detail-value">{portfolio.languages || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Portfolio:</span>
              <span className="detail-value">
                {portfolio.portfolio_url ? (
                  <a href={portfolio.portfolio_url} target="_blank" rel="noopener noreferrer">
                    View Portfolio
                  </a>
                ) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>About Me</h3>
          <p>{portfolio.about_me || 'No description available.'}</p>
        </div>

        <div className="meta-info">
          <p>Profile created: {new Date(portfolio.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PortFolioDetails;