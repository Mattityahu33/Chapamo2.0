import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeAllMenus();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getUserInitial = () =>
    currentUser?.username?.[0]?.toUpperCase() ||
    currentUser?.email?.[0]?.toUpperCase() ||
    "U";

  const avatarColors = [
    "#2563eb",
    "#7c3aed",
    "#db2777",
    "#ea580c",
    "#0891b2",
    "#16a34a",
    "#4f46e5",
    "#dc2626",
  ];

  const getUserColor = () =>
    avatarColors[getUserInitial().charCodeAt(0) % avatarColors.length];

  return (
    <nav
      ref={navRef}
      className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
    >
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={closeAllMenus}>
          <span className="navbar__logo-mark">
            <span className="navbar__logo-icon">◈</span>
          </span>
          <span className="navbar__logo-text">Chapamo</span>
        </Link>

        <ul
          id="mobile-navigation"
          className={`navbar__menu ${isMobileMenuOpen ? "navbar__menu--open" : ""}`}
        >
          <li className="navbar__mobile-header" aria-hidden="true">
            <span className="navbar__mobile-badge">Navigation</span>
            <h4>Explore opportunities faster</h4>
            <p>Jobs, portfolios, company updates, and your personal workspace.</p>
          </li>

          <li>
            <Link
              to="/"
              className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}
              onClick={closeAllMenus}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/jobs"
              className={`navbar__link ${isActive("/jobs") ? "navbar__link--active" : ""}`}
              onClick={closeAllMenus}
            >
              Jobs
            </Link>
          </li>

          <li>
            <Link
              to="/postjob"
              className={`navbar__link ${isActive("/postjob") ? "navbar__link--active" : ""}`}
              onClick={closeAllMenus}
            >
              Post a Job
            </Link>
          </li>

          <li
            className={`navbar__dropdown ${
              activeDropdown === "portfolios" ? "navbar__dropdown--open" : ""
            }`}
          >
            <button
              type="button"
              className={`navbar__link navbar__dropdown-trigger ${
                isActive("/portfolios") || isActive("/create")
                  ? "navbar__link--active"
                  : ""
              }`}
              onClick={() => toggleDropdown("portfolios")}
              aria-expanded={activeDropdown === "portfolios"}
              aria-haspopup="true"
            >
              <span>Portfolios</span>
              <span className="navbar__chevron">▾</span>
            </button>

            <ul className="navbar__dropdown-menu navbar__dropdown-menu--nav" role="menu">
              <li role="none">
                <Link to="/portfolios" onClick={closeAllMenus} role="menuitem">
                  Browse Portfolios
                </Link>
              </li>
              <li role="none">
                <Link to="/create" onClick={closeAllMenus} role="menuitem">
                  Create Portfolio
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="/news"
              className={`navbar__link ${isActive("/news") ? "navbar__link--active" : ""}`}
              onClick={closeAllMenus}
            >
              News
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className={`navbar__link ${isActive("/about") ? "navbar__link--active" : ""}`}
              onClick={closeAllMenus}
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className={`navbar__link ${isActive("/contact") ? "navbar__link--active" : ""}`}
              onClick={closeAllMenus}
            >
              Contact
            </Link>
          </li>

          {currentUser ? (
            <li
              className={`navbar__dropdown ${
                activeDropdown === "user" ? "navbar__dropdown--open" : ""
              }`}
            >
              <button
                type="button"
                className="navbar__link navbar__user-trigger"
                onClick={() => toggleDropdown("user")}
                aria-expanded={activeDropdown === "user"}
                aria-haspopup="true"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="User avatar"
                    className="navbar__avatar-img"
                  />
                ) : (
                  <span
                    className="navbar__avatar"
                    style={{ backgroundColor: getUserColor() }}
                  >
                    {getUserInitial()}
                  </span>
                )}

                <span className="navbar__username">
                  {currentUser.username || "Account"}
                </span>
                <span className="navbar__chevron">▾</span>
              </button>

              <ul className="navbar__dropdown-menu navbar__dropdown-menu--user" role="menu">
                <li className="navbar__user-summary" aria-hidden="true">
                  <div
                    className="navbar__user-summary-avatar"
                    style={{ backgroundColor: getUserColor() }}
                  >
                    {getUserInitial()}
                  </div>
                  <div>
                    <strong>{currentUser.username || "User"}</strong>
                    
                  </div>
                </li>

                <li role="none">
                  <Link
                    to={currentUser.role === "admin" ? "/admin" : "/user"}
                    onClick={closeAllMenus}
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                </li>

                <li role="none">
                  <Link
                    to="/user/SavedJobs"
                    onClick={closeAllMenus}
                    role="menuitem"
                  >
                    Saved Jobs
                  </Link>
                </li>

                <li className="navbar__dropdown-divider" role="separator" />

                <li role="none">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="navbar__logout-btn"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <li className="navbar__auth">
              <Link
                to="/login"
                className="navbar__link navbar__btn-login"
                onClick={closeAllMenus}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="navbar__btn-register"
                onClick={closeAllMenus}
              >
                Get Started
              </Link>
            </li>
          )}
        </ul>

        <button
          className={`navbar__toggle ${isMobileMenuOpen ? "navbar__toggle--open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          type="button"
        >
          <span className="navbar__bar" />
          <span className="navbar__bar" />
          <span className="navbar__bar" />
        </button>

        {isMobileMenuOpen && (
          <div
            className="navbar__backdrop"
            onClick={closeAllMenus}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;