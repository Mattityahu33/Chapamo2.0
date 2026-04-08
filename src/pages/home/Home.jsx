import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase, faLaptopCode, faTractor, faChartLine,
  faHeartbeat, faIndustry, faMicrochip, faMapMarkerAlt,
  faCity, faBuilding, faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import api from '../../restAPI/api';
import './Home.css';

/* ============================================================
   HOME PAGE
   ============================================================ */
function Home() {
  return (
    <div className="home">
      <Hero />
      <StatsStrip />
      <JobLinks />
      <JobBoardSection />
      <CareerAdviceSlider />
      <HomepagePortfolios />
      <JobPostingGuide />
      <VisionStatement />
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */
const slides = [
  { image: '/images/hunter.jpg',      alt: 'Diverse team working together' },
  { image: '/images/networking.jpeg', alt: 'Professional workplace environment' },
  { image: '/images/contact1.png',    alt: 'Team collaboration meeting' },
];

const popularTags = ['Software Engineer', 'Marketing', 'Remote', 'Lusaka', 'Finance', 'Healthcare'];

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim() && !location.trim()) return;
    try {
      const { data: results } = await api.get('/search', {
        params: { search: searchTerm, location }
      });
      navigate('/search-results', { state: { results, searchTerm, location } });
    } catch (error) {
      console.error('Search failed:', error.message);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="hero" aria-label="Hero — search and slideshow">
      {/* Background Slideshow */}
      <div className="hero__slideshow" aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero__slide ${index === currentSlide ? 'hero__slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero__slide-overlay" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__badge">🇿🇲 Zambia's #1 Job Platform</div>
        <h1 className="hero__title">
          Find Your <span className="hero__title-accent">Dream Job</span><br />
          in Zambia
        </h1>
        <p className="hero__subtitle">
          Discover thousands of job opportunities tailored to your skills and ambitions.
        </p>

        {/* Search Form */}
        <form className="hero__search" onSubmit={handleSearch}>
          <div className="hero__search-field">
            <FiSearch className="hero__search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Job title, keyword, or company..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="hero__search-input"
              aria-label="Search jobs"
            />
          </div>
          <div className="hero__search-divider" aria-hidden="true" />
          <div className="hero__search-field">
            <FiMapPin className="hero__search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="City or province..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="hero__search-input"
              aria-label="Job location"
            />
          </div>
          <button type="submit" className="hero__search-btn">
            Search Jobs
          </button>
        </form>

        {/* Popular Tags */}
        <div className="hero__tags">
          <span className="hero__tags-label">Popular:</span>
          {popularTags.map(tag => (
            <button key={tag} className="hero__tag" onClick={() => handleTagClick(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Controls */}
      <div className="hero__controls" aria-label="Slideshow controls">
        <button
          className="hero__ctrl-btn"
          onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)}
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>
        <div className="hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === currentSlide ? 'hero__dot--active' : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="hero__ctrl-btn"
          onClick={() => setCurrentSlide(p => (p + 1) % slides.length)}
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

/* ============================================================
   STATS STRIP
   ============================================================ */
const stats = [
  { value: '500+', label: 'Active Jobs' },
  { value: '200+', label: 'Professionals' },
  { value: '50+',  label: 'Companies' },
  { value: '10+',  label: 'Industries' },
];

const StatsStrip = () => (
  <div className="stats-strip">
    {stats.map((s, i) => (
      <div key={i} className="stats-strip__item">
        <span className="stats-strip__value">{s.value}</span>
        <span className="stats-strip__label">{s.label}</span>
      </div>
    ))}
  </div>
);

/* ============================================================
   JOB LINKS (Category / Industry / Region Cards)
   ============================================================ */
const JobLinks = () => {
  const navigate = useNavigate();
  const handleSearchRedirect = (params) => {
    const query = new URLSearchParams(params).toString();
    navigate(`/search-results?${query}`);
  };

  const cards = [
    {
      icon: faBriefcase,
      title: 'Job Categories',
      items: [
        { icon: faLaptopCode, label: 'Information Technology', param: { category: 'Information Technology' } },
        { icon: faTractor,    label: 'Agriculture',            param: { category: 'Agriculture' } },
        { icon: faChartLine,  label: 'Business & Finance',     param: { category: 'Business' } },
      ],
      viewAll: () => navigate('/jobs'),
      viewLabel: 'View All Categories',
    },
    {
      icon: faIndustry,
      title: 'Job Industries',
      items: [
        { icon: faMicrochip,  label: 'Technology',  param: { industry: 'Technology' } },
        { icon: faHeartbeat,  label: 'Healthcare',  param: { industry: 'Healthcare' } },
        { icon: faChartLine,  label: 'Finance',     param: { industry: 'Finance' } },
      ],
      viewAll: () => navigate('/jobs'),
      viewLabel: 'View All Industries',
    },
    {
      icon: faMapMarkerAlt,
      title: 'Job Regions',
      items: [
        { icon: faCity,     label: 'Lusaka',   param: { location: 'Lusaka' } },
        { icon: faBuilding, label: 'Kitwe',    param: { location: 'Kitwe' } },
        { icon: faCity,     label: 'Ndola',    param: { location: 'Ndola' } },
      ],
      viewAll: () => navigate('/jobs'),
      viewLabel: 'View All Regions',
    },
  ];

  return (
    <section className="job-links">
      <div className="container">
        <div className="section-header">
          <span className="section-header__eyebrow">Explore</span>
          <h2 className="section-header__title">Find Your Perfect Opportunity</h2>
          <p className="section-header__subtitle">
            Browse by category, industry, or location to find the role that fits you.
          </p>
        </div>
        <div className="job-links__grid">
          {cards.map((card, i) => (
            <div key={i} className="job-links__card card">
              <div className="job-links__card-header">
                <span className="job-links__card-icon">
                  <FontAwesomeIcon icon={card.icon} />
                </span>
                <h3 className="job-links__card-title">{card.title}</h3>
              </div>
              <ul className="job-links__card-items">
                {card.items.map((item, j) => (
                  <li key={j}>
                    <button
                      className="job-links__item"
                      onClick={() => handleSearchRedirect(item.param)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="job-links__item-icon" />
                      <span>{item.label}</span>
                      <FontAwesomeIcon icon={faArrowRight} className="job-links__item-arrow" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="job-links__card-footer">
                <button className="btn btn-outline btn-sm" onClick={card.viewAll}>
                  {card.viewLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   JOB BOARD SECTION
   ============================================================ */
const JobCardSkeleton = () => (
  <div className="home-job-card home-job-card--skeleton">
    <div className="home-job-card__header">
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '45%' }} />
      </div>
    </div>
    <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 6 }} />
    <div className="skeleton" style={{ height: 12, width: '75%', marginBottom: 6 }} />
    <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 20 }} />
      <div className="skeleton" style={{ height: 32, width: 100, borderRadius: 20 }} />
    </div>
  </div>
);

const typeColorMap = {
  'full-time': 'success',
  'part-time': 'warning',
  'contract': 'info',
  'internship': 'neutral',
  'remote': 'primary',
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const HomeJobCard = ({ job }) => {
  const typeKey = job.job_type?.toLowerCase().replace(/\s+/g, '-') || '';
  const badgeClass = `badge badge-${typeColorMap[typeKey] || 'neutral'}`;
  const initial = job.company_name?.charAt(0)?.toUpperCase() || 'C';

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'];
  const avatarColor = COLORS[initial.charCodeAt(0) % COLORS.length];

  return (
    <div className="home-job-card">
      <div className="home-job-card__header">
        <div className="home-job-card__avatar" style={{ backgroundColor: avatarColor }}>
          {initial}
        </div>
        <div className="home-job-card__title-area">
          <h3 className="home-job-card__title">{job.advert_title}</h3>
          <p className="home-job-card__company">{job.company_name}</p>
        </div>
      </div>

      <div className="home-job-card__meta">
        <span className="home-job-card__location">
          {job.is_remote ? '🌍 Remote' : `📍 ${job.location}`}
        </span>
        {job.experience_level && (
          <span className="chip">{job.experience_level}</span>
        )}
      </div>

      <p className="home-job-card__desc">
        {job.description?.substring(0, 100)}…
      </p>

      <div className="home-job-card__footer">
        <span className={badgeClass}>{job.job_type}</span>
        <span className="home-job-card__date">{timeAgo(job.created_at)}</span>
        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
          View
        </Link>
      </div>
    </div>
  );
};

const JobBoardSection = () => {
  const [jobs, setJobs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobsPerPage = 4;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/job_postings');
        const data = response.data || [];
        setJobs(Array.isArray(data) ? data.slice(0, 12) : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
        setError('Failed to load job postings.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const totalSlides = Math.ceil(jobs.length / jobsPerPage);
  const displayedJobs = jobs.slice(currentSlide * jobsPerPage, (currentSlide + 1) * jobsPerPage);

  const handlePrev = () => setCurrentSlide(p => Math.max(0, p - 1));
  const handleNext = () => setCurrentSlide(p => Math.min(totalSlides - 1, p + 1));

  return (
    <section className="job-board-section">
      <div className="container">
        <div className="job-board-section__head">
          <div>
            <span className="section-header__eyebrow">Latest</span>
            <h2 className="job-board-section__title">Recent Job Posts</h2>
          </div>
          <div className="job-board-section__nav">
            <button
              className="job-board-section__nav-btn"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              aria-label="Previous page"
            >
              <FaChevronLeft />
            </button>
            <span className="job-board-section__slide-info">
              {currentSlide + 1} / {Math.max(1, totalSlides)}
            </span>
            <button
              className="job-board-section__nav-btn"
              onClick={handleNext}
              disabled={currentSlide >= totalSlides - 1}
              aria-label="Next page"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {error ? (
          <div className="error-state">
            <div className="error-state__icon">⚠️</div>
            <p className="error-state__title">{error}</p>
          </div>
        ) : (
          <div className="job-board-section__grid">
            {loading
              ? [...Array(4)].map((_, i) => <JobCardSkeleton key={i} />)
              : displayedJobs.map(job => <HomeJobCard key={job.id} job={job} />)
            }
          </div>
        )}

        {/* Progress Bar */}
        {!loading && jobs.length > 0 && (
          <div className="job-board-section__progress-track">
            <div
              className="job-board-section__progress-fill"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
        )}

        <div className="job-board-section__cta">
          <Link to="/jobs" className="btn btn-outline">
            Browse All Jobs <FaChevronRight style={{ fontSize: 12 }} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   CAREER ADVICE SLIDER
   ============================================================ */
const careerTips = [
  { id: 1, icon: '📁', title: 'Perfect Your Portfolio', content: 'Showcase your best work with clear descriptions of your role and the impact you made. Quality over quantity matters most.', cta: 'View portfolio examples', link: '/portfolios' },
  { id: 2, icon: '✍️', title: 'Tailor Your Applications', content: 'Customize your resume and cover letter for each position. Highlight relevant skills that match the job description.', cta: 'Browse jobs', link: '/jobs' },
  { id: 3, icon: '🤝', title: 'Network Effectively', content: 'Connect with professionals in your field. A recommendation can often get your application noticed faster.', cta: 'View talent', link: '/portfolios' },
  { id: 4, icon: '💬', title: 'Prepare for Interviews', content: "Research common questions and practice your responses. Remember to prepare questions for your interviewer too.", cta: 'Read more tips', link: '/news' },
];

const CareerAdviceSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % careerTips.length), 8000);
    return () => clearInterval(t);
  }, []);

  const tip = careerTips[current];

  return (
    <section className="career-slider">
      <div className="container">
        <div className="career-slider__card">
          <div className="career-slider__left">
            <span className="section-header__eyebrow">Career Tips</span>
            <div className="career-slider__tip">
              <span className="career-slider__tip-icon">{tip.icon}</span>
              <h3 className="career-slider__tip-title">{tip.title}</h3>
              <p className="career-slider__tip-body">
                <FaQuoteLeft className="career-slider__quote-icon" aria-hidden="true" />
                {tip.content}
              </p>
              <Link to={tip.link} className="btn btn-primary btn-sm">
                {tip.cta}
              </Link>
            </div>
          </div>
          <div className="career-slider__right">
            <div className="career-slider__progress-list">
              {careerTips.map((t, i) => (
                <button
                  key={t.id}
                  className={`career-slider__progress-item ${i === current ? 'career-slider__progress-item--active' : ''}`}
                  onClick={() => setCurrent(i)}
                >
                  <span className="career-slider__progress-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="career-slider__progress-label">{t.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   HOMEPAGE PORTFOLIOS
   ============================================================ */
const PortfolioCardSkeleton = () => (
  <div className="hp-portfolio-card hp-portfolio-card--skeleton">
    <div className="skeleton" style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px' }} />
    <div className="skeleton" style={{ height: 16, width: '70%', margin: '0 auto 8px' }} />
    <div className="skeleton" style={{ height: 12, width: '50%', margin: '0 auto 8px' }} />
    <div className="skeleton" style={{ height: 12, width: '40%', margin: '0 auto 16px' }} />
    <div className="skeleton" style={{ height: 32, borderRadius: 20 }} />
  </div>
);

const HomepagePortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const res = await api.get('/portfolios?limit=12');
        const data = res.data || [];
        setPortfolios(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch portfolios.');
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const total = scrollWidth - clientWidth;
    setProgress(total ? (scrollLeft / total) * 100 : 0);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < total - 10);
  };

  const scrollBy = (dist) => scrollRef.current?.scrollBy({ left: dist, behavior: 'smooth' });

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'];
  const getColor = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

  return (
    <section className="hp-portfolios">
      <div className="container">
        <div className="section-header">
          <span className="section-header__eyebrow">Talent Showcase</span>
          <h2 className="section-header__title">Discover Top Professionals</h2>
          <p className="section-header__subtitle">Browse portfolios from Zambia's best talent.</p>
        </div>

        <div className="hp-portfolios__scroll-wrapper">
          {canScrollLeft && (
            <button className="hp-portfolios__scroll-btn hp-portfolios__scroll-btn--left" onClick={() => scrollBy(-320)} aria-label="Scroll left">
              <FaChevronLeft />
            </button>
          )}
          <div className="hp-portfolios__scroll" ref={scrollRef} onScroll={onScroll}>
            {loading
              ? [...Array(5)].map((_, i) => <PortfolioCardSkeleton key={i} />)
              : error
                ? <p className="hp-portfolios__error">{error}</p>
                : portfolios.map(p => (
                    <div key={p.id} className="hp-portfolio-card">
                      {p.profile_image_url ? (
                        <img
                          src={p.profile_image_url}
                          alt={p.full_name}
                          className="hp-portfolio-card__img"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="hp-portfolio-card__avatar" style={{ backgroundColor: getColor(p.full_name) }}>
                          {p.full_name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                      )}
                      <h3 className="hp-portfolio-card__name">{p.full_name}</h3>
                      <p className="hp-portfolio-card__profession">{p.profession_title}</p>
                      <p className="hp-portfolio-card__location">📍 {p.location}</p>
                      {p.availability && (
                        <span className="badge badge-success hp-portfolio-card__badge">{p.availability}</span>
                      )}
                      <Link to={`/portfolios/${p.id}`} className="btn btn-outline btn-sm hp-portfolio-card__btn">
                        View Profile
                      </Link>
                    </div>
                  ))
            }
          </div>
          {canScrollRight && (
            <button className="hp-portfolios__scroll-btn hp-portfolios__scroll-btn--right" onClick={() => scrollBy(320)} aria-label="Scroll right">
              <FaChevronRight />
            </button>
          )}
        </div>

        {!loading && portfolios.length > 0 && (
          <div className="hp-portfolios__progress-track">
            <div className="hp-portfolios__progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <Link to="/portfolios" className="btn btn-outline">
            View All Portfolios <FaChevronRight style={{ fontSize: 12 }} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   JOB POSTING GUIDE
   ============================================================ */
const steps = [
  { n: '01', title: 'Create Your Employer Profile', desc: 'Set up your company profile to showcase your brand and attract the right candidates.' },
  { n: '02', title: 'Post Your Job Listing', desc: 'Use our simple form to create detailed job postings with requirements, benefits, and salary.' },
  { n: '03', title: 'Reach Quality Candidates', desc: 'Your listing reaches Zambia\'s largest pool of active job seekers instantly.' },
  { n: '04', title: 'Manage Applications', desc: 'Review candidate profiles and connect with your best matches directly through the platform.' },
];

const JobPostingGuide = () => (
  <section className="job-guide">
    <div className="container">
      <div className="section-header">
        <span className="section-header__eyebrow">For Employers</span>
        <h2 className="section-header__title">Hire Top Talent in 4 Steps</h2>
        <p className="section-header__subtitle">Post a job and start receiving applications from qualified candidates today.</p>
      </div>

      <div className="job-guide__steps">
        {steps.map(s => (
          <div key={s.n} className="job-guide__step">
            <div className="job-guide__step-num">{s.n}</div>
            <h3 className="job-guide__step-title">{s.title}</h3>
            <p className="job-guide__step-desc">{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <Link to="/postjob" className="btn btn-primary btn-lg">
          Post a Job Now
        </Link>
        <p style={{ marginTop: 'var(--space-3)', color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>
          Get your first 3 job postings free
        </p>
      </div>
    </div>
  </section>
);

/* ============================================================
   VISION STATEMENT
   ============================================================ */
const visionCards = [
  { title: 'For Job Seekers', icon: '🎯', desc: "Find meaningful work with companies that value your skills. No more endless searches — connect directly with opportunities that match your expertise." },
  { title: 'For Employers', icon: '🏢', desc: "Build your dream team by connecting with Zambia's most qualified professionals. See candidates who truly fit your requirements." },
  { title: 'Our Community', icon: '🌍', desc: "We're building a platform that empowers Zambia's workforce — transparent, efficient, and inclusive for everyone." },
];

const coreValues = ['Transparency', 'Efficiency', 'Diversity', 'Innovation', 'Community'];

const VisionStatement = () => (
  <section className="vision">
    <div className="container">
      <div className="section-header" style={{ color: 'white' }}>
        <span className="section-header__eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Our Mission</span>
        <h2 className="section-header__title" style={{ color: 'white' }}>
          Bridging Talent &amp; Opportunity
        </h2>
        <p className="section-header__subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Connecting exceptional talent with innovative companies across Zambia.
        </p>
      </div>

      <div className="vision__cards">
        {visionCards.map((c, i) => (
          <div key={i} className="vision__card">
            <div className="vision__card-icon">{c.icon}</div>
            <h3 className="vision__card-title">{c.title}</h3>
            <p className="vision__card-desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="vision__values">
        <p className="vision__values-label">Core Values</p>
        <div className="vision__values-list">
          {coreValues.map(v => (
            <span key={v} className="vision__value-chip">{v}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Home;
