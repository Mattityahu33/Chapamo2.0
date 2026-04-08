import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAfrica, FaPeopleArrows, FaRegLightbulb, FaRocket, FaShieldAlt } from 'react-icons/fa';
import './About.css';

const valueCards = [
  {
    icon: <FaRegLightbulb />,
    title: 'Mission-led product',
    text: 'Chapamo exists to make opportunity easier to discover, present, and act on for both talent and employers.',
  },
  {
    icon: <FaRocket />,
    title: 'Built for momentum',
    text: 'We reduce friction across hiring and self-presentation so people can move from discovery to action faster.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Trust by design',
    text: 'Clear information architecture, strong presentation, and simple workflows help the platform feel credible and dependable.',
  },
];

const offerItems = [
  'Job discovery for active seekers and growing teams',
  'Portfolio creation that helps professionals present their value clearly',
  'A cleaner digital bridge between employers and talent in Zambia',
  'A platform foundation that can expand into richer hiring workflows over time',
];

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container about-hero__grid">
          <div className="about-hero__content">
            <span className="badge badge-primary">About Chapamo</span>
            <h1>We’re building a stronger bridge between talent, portfolios, and real opportunity.</h1>
            <p>
              Chapamo is designed to help professionals present themselves better and help
              employers discover talent with more confidence, clarity, and speed.
            </p>
          </div>

          <div className="about-hero__panel card">
            <div className="about-hero__panel-item">
              <FaGlobeAfrica />
              <div>
                <strong>Local relevance</strong>
                <span>Designed around the realities of Zambia’s digital job market.</span>
              </div>
            </div>
            <div className="about-hero__panel-item">
              <FaPeopleArrows />
              <div>
                <strong>Two-sided value</strong>
                <span>Useful for both people seeking work and companies hiring carefully.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="section-header">
            <span className="section-header__eyebrow">Why It Matters</span>
            <h2 className="section-header__title">A premium employment platform should feel useful, trustworthy, and focused.</h2>
            <p className="section-header__subtitle">
              The experience should help people make better decisions quickly, not fight through clutter.
            </p>
          </div>

          <div className="about-values__grid">
            {valueCards.map((card) => (
              <article key={card.title} className="about-value-card card">
                <div className="about-value-card__icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story__grid">
          <div className="about-story__content">
            <span className="section-header__eyebrow">Our Story</span>
            <h2>From a simple idea to a clearer employment experience.</h2>
            <p>
              Chapamo started from a straightforward need: people should be able to find jobs,
              present their experience, and connect with opportunity without navigating a confusing
              interface. That belief shaped a platform that brings together jobs, portfolios, and a
              more modern digital experience.
            </p>
            <p>
              The result is a product direction centered on clarity, presentation quality, and a
              stronger sense of confidence for both candidates and employers.
            </p>
          </div>

          <div className="about-story__panel card">
            <h3>What the platform offers</h3>
            <ul>
              {offerItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container about-cta__card card">
          <div>
            <span className="section-header__eyebrow">Next Step</span>
            <h2>Want to learn more or explore the platform in action?</h2>
            <p>
              Browse open roles, view professional portfolios, or reach out if you want to connect
              around partnerships, product direction, or growth.
            </p>
          </div>
          <div className="about-cta__actions">
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
