import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FiBriefcase, FiEdit3, FiExternalLink, FiMail, FiMapPin, FiPhone, FiTrash2, FiUser } from 'react-icons/fi';
import api from '../../../restAPI/api';
import './UserDashboard.css';

const readPayload = (payload) => payload?.data || payload;

const splitItems = (value) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [userError, setUserError] = useState(null);
  const [portfolioError, setPortfolioError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me', { withCredentials: true });
        setUser(readPayload(res));
      } catch (err) {
        console.error(err);
        setUserError('Failed to fetch user info.');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoadingPortfolio(false);
      return;
    }

    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/portfolios/user/me', { withCredentials: true });
        setPortfolio(readPayload(res));
        setPortfolioError(null);
      } catch (err) {
        console.error(err);
        setPortfolio(null);
        setPortfolioError("You don't have a portfolio yet.");
      } finally {
        setLoadingPortfolio(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  const handleDeletePortfolio = async () => {
    if (!portfolio) {
      alert('No portfolio found to delete.');
      return;
    }

    if (!window.confirm('Are you sure you want to permanently delete your portfolio? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/portfolios/${portfolio.id}`, { withCredentials: true });
      alert('Your portfolio has been deleted.');
      setPortfolio(null);
      setShowConfirm(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete portfolio. Please try again.');
    }
  };

  const skills = useMemo(() => splitItems(portfolio?.skills), [portfolio]);
  const certifications = useMemo(() => splitItems(portfolio?.certifications), [portfolio]);
  const languages = useMemo(() => splitItems(portfolio?.languages), [portfolio]);

  if (loadingUser || loadingPortfolio) {
    return (
      <div className="user-dashboard-page">
        <div className="container">
          <div className="user-dashboard-state card">
            <div className="spinner spinner-dark" />
            <p>Loading user dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="user-dashboard-page">
        <div className="container">
          <div className="user-dashboard-state card is-error">{userError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard-page">
      <div className="container user-dashboard">
        <section className="user-dashboard-hero card">
          <div>
            <span className="badge badge-primary">User Dashboard</span>
            <h1>Welcome back, {user?.username}.</h1>
            <p>Manage your profile, review your portfolio presence, and keep your professional details current.</p>
          </div>
          <div className="user-dashboard-hero__meta">
            <span><FiMail /> {user?.email}</span>
            <span><FiUser /> User ID: {user?.id}</span>
          </div>
        </section>

        <section className="user-dashboard-stats">
          <article className="user-stat card">
            <strong>{portfolio ? 'Live' : 'Missing'}</strong>
            <span>Portfolio status</span>
          </article>
          <article className="user-stat card">
            <strong>{skills.length}</strong>
            <span>Skills listed</span>
          </article>
          <article className="user-stat card">
            <strong>{languages.length}</strong>
            <span>Languages added</span>
          </article>
          <article className="user-stat card">
            <strong>{portfolio?.experience_years || 0}</strong>
            <span>Years of experience</span>
          </article>
        </section>

        <section className="user-dashboard-layout">
          <div className="user-dashboard-main">
            {portfolio ? (
              <article className="user-portfolio card">
                <div className="user-portfolio__header">
                  <div className="user-portfolio__identity">
                    <img
                      src={portfolio.profile_image_url || '/default-profile.png'}
                      alt={portfolio.full_name}
                      className="user-portfolio__image"
                      onError={(e) => {
                        e.currentTarget.src = '/default-profile.png';
                      }}
                    />
                    <div>
                      <h2>{portfolio.full_name}</h2>
                      <p>{portfolio.profession_title}</p>
                      <span><FiMapPin /> {portfolio.location || 'Location not set'}</span>
                    </div>
                  </div>
                  <span className="badge badge-success">{portfolio.availability || 'Availability not set'}</span>
                </div>

                <div className="user-portfolio__summary">
                  <h3>About Me</h3>
                  <p>{portfolio.about_me || 'No description available.'}</p>
                </div>

                <div className="user-portfolio__grid">
                  <Detail label="Phone" value={portfolio.phone || 'N/A'} icon={<FiPhone />} />
                  <Detail label="Email" value={portfolio.email || 'N/A'} icon={<FiMail />} />
                  <Detail
                    label="Experience"
                    value={portfolio.experience_years ? `${portfolio.experience_years} years` : 'N/A'}
                    icon={<FiBriefcase />}
                  />
                  <Detail
                    label="Portfolio"
                    value={
                      portfolio.portfolio_url ? (
                        <a href={portfolio.portfolio_url} target="_blank" rel="noreferrer">
                          Open portfolio <FiExternalLink />
                        </a>
                      ) : (
                        'N/A'
                      )
                    }
                    icon={<FiExternalLink />}
                  />
                </div>

                <div className="user-portfolio__tags">
                  <TagGroup title="Skills" items={skills} empty="No skills added yet." />
                  <TagGroup title="Certifications" items={certifications} empty="No certifications added yet." />
                  <TagGroup title="Languages" items={languages} empty="No languages added yet." />
                </div>

                <div className="user-portfolio__footer">
                  <span>Profile created: {new Date(portfolio.created_at).toLocaleDateString()}</span>
                </div>
              </article>
            ) : (
              <article className="user-empty card">
                <h2>No portfolio yet</h2>
                <p>{portfolioError || 'Create a portfolio to showcase your profile to recruiters and employers.'}</p>
                <Link to="/create" className="btn btn-primary">Create Portfolio</Link>
              </article>
            )}
          </div>

          <aside className="user-dashboard-sidebar">
            <nav className="user-actions card">
              <h3>Quick actions</h3>
              <Link to="SavedJobs" className="btn btn-outline">
                Saved Jobs
              </Link>
              <Link to="profile" className="btn btn-outline">
                <FiEdit3 />
                Edit Profile
              </Link>
              {portfolio && (
                <button className="btn user-delete-btn" onClick={() => setShowConfirm(true)}>
                  <FiTrash2 />
                  Delete Portfolio
                </button>
              )}
            </nav>

            <div className="user-panel card">
              <h3>Profile health</h3>
              <ul>
                <li className={portfolio?.full_name ? 'is-complete' : ''}>Name and title</li>
                <li className={portfolio?.about_me ? 'is-complete' : ''}>Professional summary</li>
                <li className={skills.length ? 'is-complete' : ''}>Skills coverage</li>
                <li className={portfolio?.portfolio_url ? 'is-complete' : ''}>External portfolio link</li>
              </ul>
            </div>
          </aside>
        </section>

        <Outlet />
      </div>

      {showConfirm && (
        <div className="user-modal-overlay">
          <div className="user-modal card">
            <h3>Delete portfolio?</h3>
            <p>This action permanently removes your portfolio and cannot be undone.</p>
            <div className="user-modal__actions">
              <button className="btn user-delete-btn" onClick={handleDeletePortfolio}>Proceed</button>
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Detail = ({ label, value, icon }) => (
  <div className="user-detail">
    <span className="user-detail__label">
      {icon}
      {label}
    </span>
    <div className="user-detail__value">{value}</div>
  </div>
);

const TagGroup = ({ title, items, empty }) => (
  <div className="user-tag-group">
    <h3>{title}</h3>
    {items.length ? (
      <div className="user-tag-group__chips">
        {items.map((item) => (
          <span key={item} className="chip">{item}</span>
        ))}
      </div>
    ) : (
      <p>{empty}</p>
    )}
  </div>
);
