import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Top accent bar */}
      <div className="footer__accent" aria-hidden="true" />

      <div className="footer__main">
        <div className="footer__container">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">◈</span>chapamo
            </Link>
            <p className="footer__tagline">
              Zambia's premier jobs and talent marketplace. Connecting the right people with the right opportunities.
            </p>
            <div className="footer__social">
              <a href="https://twitter.com" aria-label="Twitter" className="footer__social-link"><FaTwitter /></a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="footer__social-link"><FaLinkedin /></a>
              <a href="https://facebook.com" aria-label="Facebook" className="footer__social-link"><FaFacebook /></a>
              <a href="https://instagram.com" aria-label="Instagram" className="footer__social-link"><FaInstagram /></a>
              <a href="https://github.com" aria-label="GitHub" className="footer__social-link"><FaGithub /></a>
            </div>
          </div>

          {/* Jobs Column */}
          <div className="footer__col">
            <h4 className="footer__col-title">Jobs</h4>
            <ul className="footer__links">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/postjob">Post a Job</Link></li>
              <li><Link to="/jobs?type=full-time">Full-Time</Link></li>
              <li><Link to="/jobs?type=contract">Contract</Link></li>
              <li><Link to="/jobs?remote=true">Remote Jobs</Link></li>
            </ul>
          </div>

          {/* Talent Column */}
          <div className="footer__col">
            <h4 className="footer__col-title">Talent</h4>
            <ul className="footer__links">
              <li><Link to="/portfolios">Browse Portfolios</Link></li>
              <li><Link to="/create">Create Portfolio</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/news">News &amp; Updates</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer__col footer__col--wide">
            <h4 className="footer__col-title">Stay Updated</h4>
            <p className="footer__newsletter-text">
              Get the latest job postings and career tips delivered to your inbox.
            </p>
            <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email for newsletter"
                className="footer__newsletter-input"
                required
              />
              <button type="submit" className="footer__newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__container footer__bottom-inner">
          <p className="footer__copyright">
            © {currentYear} Chapamo. All rights reserved.
          </p>
          <div className="footer__legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;