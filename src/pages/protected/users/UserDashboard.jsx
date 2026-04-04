import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import api from "../../../restAPI/api";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [userError, setUserError] = useState(null);
  const [portfolioError, setPortfolioError] = useState(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);


  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setUserError("Failed to fetch user info.");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch portfolio after user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchPortfolio = async () => {
      try {
        const res = await api.get("/portfolios/user/me", { withCredentials: true });
        setPortfolio(res.data);
      } catch (err) {
        console.error(err);
        setPortfolioError("You don't have a portfolio yet.");
      } finally {
        setLoadingPortfolio(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  // Handle portfolio deletion
  const handleDeletePortfolio = async () => {
    if (!portfolio) {
      alert("No portfolio found to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently delete your portfolio? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/portfolios/${portfolio.id}`, { withCredentials: true });
      alert("Your portfolio has been deleted.");
      setPortfolio(null); // Remove portfolio from state
      navigate("/"); // Redirect after deletion
    } catch (err) {
      console.error(err);
      alert("Failed to delete portfolio. Please try again.");
    }
  };

  if (loadingUser || loadingPortfolio) return <p>Loading user dashboard...</p>;
  if (userError) return <p>{userError}</p>;

  return (
    <div className="user-dashboard">
      <h1>Welcome, {user.username}!</h1>

      <div className="dashboard-stats">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
     
      </div>

      {portfolio ? (
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
      ) : (
        <p>{portfolioError}</p>
      )}

      <nav className="user-nav">
        <Link to="SavedJobs">Saved Jobs</Link>
        <Link to="profile">Edit Profile</Link>
        {portfolio && (
  <button
    className="delete-portfolio-btn"
    onClick={() => setShowConfirm(true)}
  >
    Delete Portfolio
  </button>
)}
{/* Confirmation Modal */}
{showConfirm && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>⚠️ Warning</h3>
      <p>
        Are you sure you want to permanently delete your portfolio? This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button
          className="proceed-btn"
          onClick={handleDeletePortfolio}
        >
          Proceed
        </button>
        <button
          className="cancel-btn"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      </nav>

      <Outlet />
    </div>
  );
}
