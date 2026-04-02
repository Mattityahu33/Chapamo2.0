import React from 'react'
import { useState, useEffect,useRef  } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaQuoteLeft  } from 'react-icons/fa';
import SearchForm from '../../components/SearchForm';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase,
  faLaptopCode,
  faTractor,
  faChartLine,
  faHeartbeat,
  faIndustry,
  faMicrochip,
  faMapMarkerAlt,
  faCity,
  faBuilding,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

import './Home.css';



function Home() {
  return (
    <div>
      <Hero />
      <JobLinks /> 
      <JobBoardHeader />
      <JobBoard />
      <CareerAdviceSlider />
      <HomepagePortfolios />
      <NewsHeader />
      <NewsFeed />
      <JobPostingGuide/>
      <VisionStatement/>
    
    </div>
  )
}

// Inside Hero.jsx or directly in your Home.jsx file


const slides = [
  { image: '/images/hunter.jpg', alt: 'Diverse team working together' },
  { image: '/images/networking.jpeg', alt: 'Professional workplace environment' },
  { image: '/images/contact1.png', alt: 'Team collaboration meeting' }
];

const popularTags = ['Software Engineer', 'Marketing', 'Remote', 'Lusaka', 'Finance'];

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
        params: { term: searchTerm, location }
      });

      navigate('/search-results', {
        state: { results, searchTerm, location }
      });
    } catch (error) {
      console.error('Search failed:', error.message);
    }
  };

  return (
    <section className="hero" role="region" aria-label="Hero section with search and slideshow">
      <div className="slideshow">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={index !== currentSlide}
          >
            <div className="slide-overlay" />
            <img src={slide.image} alt={slide.alt} className="visually-hidden" />
          </div>
        ))}
      </div>

      <div className="hero-content">
        <h1 className="hero-title">Find Your Dream Job in Zambia</h1>
        <p className="hero-subtitle">
          Discover thousands of job opportunities tailored to your skills and ambitions.
        </p>

        {/* Reusable SearchForm */}
        <SearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          location={location}
          setLocation={setLocation}
          onSubmit={handleSearch}
          popularTags={popularTags}
        />
      </div>

      <div className="slide-controls">
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} aria-label="Previous slide">
          <FaChevronLeft />
        </button>
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)} aria-label="Next slide">
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};





/* This is job links on the homepage */
const JobLinks = () => {
  const navigate = useNavigate();

  const handleSearchRedirect = (params) => {
    const query = new URLSearchParams(params).toString();
    navigate(`/search-results?${query}`);
  };

  return (
    <div className="job__links__container">
      <div className="categories__header">
        <h2>Find Your Dream Job</h2>
        <p>Browse opportunities by category, industry, or location to find the perfect match for your skills and interests.</p>
      </div>

      <div className="categories__grid">
        {/* Job Categories Card */}
        <div className="category__card">
          <div className="card__header">
            <FontAwesomeIcon icon={faBriefcase} className="card__header-icon" />
            <h3>Job Categories</h3>
          </div>
          <div className="card__content">
            <div className="category__item" onClick={() => handleSearchRedirect({ category: 'Information Technology' })}>
              <FontAwesomeIcon icon={faLaptopCode} className="category__item-icon" /> Information Technology
            </div>
            <div className="category__item" onClick={() => handleSearchRedirect({ category: 'Agriculture' })}>
              <FontAwesomeIcon icon={faTractor} className="category__item-icon" /> Agriculture
            </div>
            <div className="category__item" onClick={() => handleSearchRedirect({ category: 'Business' })}>
              <FontAwesomeIcon icon={faChartLine} className="category__item-icon" /> Business
            </div>
            {/* Add more with handleSearchRedirect */}
          </div>
          <div className="card__footer">
            <button className="btn" onClick={() => navigate('/categories')}>
              <span>View All Categories</span> <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {/* Industries Card */}
        <div className="category__card">
          <div className="card__header">
            <FontAwesomeIcon icon={faIndustry} className="card__header-icon" />
            <h3>Job Industries</h3>
          </div>
          <div className="card__content">
            <div className="category__item" onClick={() => handleSearchRedirect({ industry: 'Technology' })}>
              <FontAwesomeIcon icon={faMicrochip} className="category__item-icon" /> Technology
            </div>
            <div className="category__item" onClick={() => handleSearchRedirect({ industry: 'Healthcare' })}>
              <FontAwesomeIcon icon={faHeartbeat} className="category__item-icon" /> Healthcare
            </div>
            {/* More industries here */}
          </div>
          <div className="card__footer">
            <button className="btn" onClick={() => navigate('/industries')}>
              <span>View All Industries</span> <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {/* Regions Card */}
        <div className="category__card">
          <div className="card__header">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="card__header-icon" />
            <h3>Job Regions</h3>
          </div>
          <div className="card__content">
            <div className="category__item" onClick={() => handleSearchRedirect({ location: 'Lusaka' })}>
              <FontAwesomeIcon icon={faCity} className="category__item-icon" /> Lusaka
            </div>
            <div className="category__item" onClick={() => handleSearchRedirect({ location: 'Kitwe' })}>
              <FontAwesomeIcon icon={faBuilding} className="category__item-icon" /> Kitwe
            </div>
            {/* More regions here */}
          </div>
          <div className="card__footer">
            <button className="btn" onClick={() => navigate('/regions')}>
              <span>View All Regions</span> <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



/*join us homepage button*/  

const JobBoardHeader = () => {
  return (
    <div className="job-board-header">
      <div className="job-board-header__content">
        <h2 className="job-board-header__title">Explore Opportunities & Talent</h2>

        <div className="job-board-header__text">
          <p className="job-board-header__subtitle">
            Browse the latest job openings and professional portfolios from top talent.
          </p>
          <p className="job-board-header__description">
            Want to post a job or showcase your portfolio? <strong>Register today</strong> and connect with the right opportunities or talent.
          </p>
        </div>

        <div className="job-board-header__cta">
          <Link to="/register" className="job-board-header__button">
            <span className="job-board-header__button-text">Register Now</span>
            <span className="job-board-header__button-icon">→</span>
              
          </Link>
        </div>
      </div>
    </div>
  );
};


/**
 * JobBoard Component - Displays a scrollable grid of job postings with navigation controls
 * 
 * 
 * Features:
 * - Horizontal scrolling job cards with smooth snap behavior
 * - Navigation arrows to move between pages
 * - Progress bar showing current scroll position
 * - Responsive design for all screen sizes
 * - Hover effects and animations
 */
 // You must define the CSS layout here

const JobCard = ({ job }) => (
  <div className="job-card">
    <div className="job-card-header">
      <div className="job-title-container">
        <h3 className="job-title">{job.advert_title}</h3>
        <p className="company-name">{job.company_name}</p>
      </div>
      <span className={`job-type-badge ${job.job_type.toLowerCase().replace(' ', '-')}`}>
        {job.job_type}
      </span>
    </div>

    <div className="job-meta">
      <span className={`meta-item ${job.is_remote ? 'remote' : 'location'}`}>
        {job.is_remote ? '🌍 Remote' : `📍 ${job.location}`}
      </span>
      <span className="meta-item category">{job.category}</span>
      <span className="meta-item experience">{job.experience_level}</span>
    </div>

    <p className="job-description">
      {job.description.substring(0, 160)}...
    </p>


    <div className="job-footer">
      <span className="post-date">
        Posted {new Date(job.created_at).toLocaleDateString()}
      </span>
      <div className="apply-actions">
        <Link to={`/jobs/${job.id}`} className="btn-apply">
          View Details
        </Link>
      </div>
    </div>
  </div>
);


const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobsPerPage = 4;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/job_postings");
        setJobs(response.data.slice(0, 12)); // Only get 12 latest jobs
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setError("Failed to load job postings.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  const totalSlides = Math.ceil(jobs.length / jobsPerPage);

  const handleScroll = (direction) => {
    if (direction === 'left' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (direction === 'right' && currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const startIndex = currentSlide * jobsPerPage;
  const displayedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <section className="job-board">
      <div className="job-board__container">
        <div className="job-board__header">
          <h2 className="job-board__title">Recent Job Posts</h2>
        </div>

        <div className="scroll-wrapper">
          <button className="scroll-btn left" onClick={() => handleScroll("left")} disabled={currentSlide === 0}>
            <FaChevronLeft />
          </button>

          <div className="job-board__grid-wrapper">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <button className="scroll-btn right" onClick={() => handleScroll("right")} disabled={currentSlide === totalSlides - 1}>
            <FaChevronRight />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="jobs__btn__container">
          <a href="/jobs" className="jobs__btn">
            <span>All Jobs</span>
          </a>
        </div>
      </div>
    </section>
  );
};


//this is the portfolio component on the homepage
const CareerAdviceSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const careerTips = [
    {
      id: 1,
      title: "Perfect Your Portfolio",
      content: "Showcase your best work with clear descriptions of your role and the impact you made. Quality over quantity matters most.",
      cta: "View portfolio examples",
      icon: "📁"
    },
    {
      id: 2,
      title: "Tailor Your Applications",
      content: "Customize your resume and cover letter for each position. Highlight relevant skills that match the job description.",
      cta: "Get application tips",
      icon: "✍️"
    },
    {
      id: 3,
      title: "Network Effectively",
      content: "Connect with professionals in your field. A recommendation can often get your application noticed faster.",
      cta: "Find networking events",
      icon: "🤝"
    },
    {
      id: 4,
      title: "Prepare for Interviews",
      content: "Research common questions and practice your responses. Remember to prepare questions for your interviewer too.",
      cta: "See interview questions",
      icon: "💬"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % careerTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [careerTips.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % careerTips.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + careerTips.length) % careerTips.length);
  };

  return (
    <div className="career-advice-slider">
      <div className="slider-container">
        <button 
          className="slider-nav-btn prev" 
          onClick={prevSlide}
          aria-label="Previous tip"
        >
          <FaChevronLeft />
        </button>
        
        <div className="slider-content">
          <div className="slider-icon">{careerTips[currentSlide].icon}</div>
          <h3>{careerTips[currentSlide].title}</h3>
          <div className="slider-quote">
            <FaQuoteLeft className="quote-icon" />
            <p>{careerTips[currentSlide].content}</p>
          </div>
          <a href="#" className="slider-cta">
            {careerTips[currentSlide].cta} <FaChevronRight className="cta-arrow" />
          </a>
        </div>
        
        <button 
          className="slider-nav-btn next" 
          onClick={nextSlide}
          aria-label="Next tip"
        >
          <FaChevronRight />
        </button>
      </div>
      
      <div className="slider-dots">
        {careerTips.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to tip ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

//this is the portfolio component on the homepage to show the recent portfolio updates


const HomepagePortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await api.get('/portfolios?limit=12'); // Limit to 12
        setPortfolios(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch portfolios. Please try again later.');
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const scrollWidthTotal = scrollWidth - clientWidth;
      const progressValue = (scrollLeft / scrollWidthTotal) * 100;
      setProgress(progressValue);
      
      // Update button visibility
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidthTotal - 10); // 10px buffer
    }
  };

  const scrollBy = (distance) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: distance,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div className="loading">Loading portfolios...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="homepage-portfolios">
      <h2 className="portfolios-title">Recent Portfolios</h2>

      {/* Scroll Wrapper with Navigation Buttons */}
      <div className="portfolios-scroll-wrapper">
        {showLeftButton && (
          <button 
            className="portfolios-scroll-btn left"
            onClick={() => scrollBy(-300)}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Horizontal Scrollable List */}
        <div
          className="portfolios-scroll-container"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="portfolio-card">
              <img
                src={portfolio.profile_image_url || '/default-profile.png'}
                alt={`${portfolio.full_name}'s profile`}
                className="portfolio-image"
                onError={(e) => {
                  e.target.src = '/default-profile.png';
                }}
              />
              <div className="portfolio-info">
                <h3>{portfolio.full_name}</h3>
                <p className="profession">{portfolio.profession_title}</p>
                <p className="location">{portfolio.location}</p>
                <Link
                  to={`/portfolios/${portfolio.id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {showRightButton && (
          <button 
            className="portfolios-scroll-btn right"
            onClick={() => scrollBy(300)}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="scroll-progress-bar">
        <div
          className="scroll-progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* View All Button */}
      <div className="view-all-container">
        <Link to="/portfolios" className="view-all-btn">
          View All Portfolios
        </Link>
      </div>
    </div>
  );
};




/**
 * NewsHeader Component - A modern header section for news/articles
 * 
 * Features:
 * - Clean, modern design with subtle pattern background
 * - "Subscribe" button with hover effects
 * - Responsive layout for all screen sizes
 * - Distinct visual style while maintaining brand colors
 */
const NewsHeader = () => {
  return (
    <div className="news-header">
      <div className="news-header__pattern"></div>
      <div className="news-header__content">
        <div className="news-header__titles">
          <h1 className="news-header__main-title">Latest News & Updates</h1>
          <h2 className="news-header__subtitle">Stay informed with our curated content</h2>
        </div>
        
        <div className="news-header__text">
          <p className="news-header__description">
            Get the latest industry insights, company updates, and expert opinions delivered straight to you.
          </p>
        </div>
        
        <div className="news-header__cta">
          <a href="/subscribe" className="news-header__button">
            <span className="news-header__button-text">Subscribe Now</span>
            <svg className="news-header__button-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};


/**new feed home components  */

const NewsFeed = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const newsCardsContainerRef = useRef(null);
  
  const newsData = [
    {
      id: 1,
      title: "Tech Industry Sees Record Growth in Q2",
      description: "The technology sector has reported unprecedented growth figures this quarter, with several major companies exceeding expectations. Analysts predict this trend will continue through the end of the year.",
      date: "Posted: June 15, 2023",
      image: "images/image4.png",
      alt: "Tech Industry Growth"
    },
    {
      id: 2,
      title: "Remote Work Trends in 2023",
      description: "New study reveals how hybrid work models are becoming the standard for knowledge workers worldwide. Companies are adapting their policies to attract top talent.",
      date: "Posted: June 10, 2023",
      image: './images/networking.jpeg',
      alt: "Remote Work Trends"
    },
    {
      id: 3,
      title: "Leadership Conference Announced",
      description: "Annual leadership summit to feature keynote speakers from Fortune 500 companies and innovative startups. Early bird registration now open.",
      date: "Posted: June 5, 2023",
      image: "./images/contact1.png'",
      alt: "Leadership Conference"
    },
    {
      id: 4,
      title: "Emerging Careers in AI",
      description: "As artificial intelligence continues to evolve, these are the most in-demand roles companies are hiring for. See if your skills match these growing opportunities.",
      date: "Posted: May 28, 2023",
      image: "./images/contact1.png'",
      alt: "AI Careers"
    },
    {
      id: 5,
      title: "Productivity Tools Comparison",
      description: "We tested the top 10 productivity apps to help you decide which one fits your workflow best. Find out which tools can save you the most time.",
      date: "Posted: May 20, 2023",
      image: "./images/contact1.png'",
      alt: "Productivity Tools"
    }
  ];

  const totalSlides = Math.ceil(newsData.length / cardsPerView);

  useEffect(() => {
    const handleResize = () => {
      const newCardsPerView = window.innerWidth <= 768 ? 1 : 3;
      setCardsPerView(newCardsPerView);
      const newTotalSlides = Math.ceil(newsData.length / newCardsPerView);
      setCurrentSlide(Math.min(currentSlide, newTotalSlides - 1));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide, newsData.length]);

  const goToSlide = (slideIndex) => {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;
    
    const cardWidth = newsCardsContainerRef.current?.firstChild?.offsetWidth || 0;
    const scrollPosition = slideIndex * cardsPerView * (cardWidth + 20); // Include gap
    
    newsCardsContainerRef.current?.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentSlide(slideIndex);
  };

  const handleScroll = () => {
    if (!newsCardsContainerRef.current) return;
    
    const scrollPosition = newsCardsContainerRef.current.scrollLeft;
    const cardWidth = newsCardsContainerRef.current?.firstChild?.offsetWidth || 0;
    const newSlide = Math.round(scrollPosition / ((cardWidth + 20) * cardsPerView));
    
    if (newSlide !== currentSlide) {
      setCurrentSlide(newSlide);
    }
  };

  const handleCardClick = (articleId, e) => {
    if (!e.target.classList.contains('news-card__read-more')) {

      // window.location.href = `/articles/${articleId}`;
    }
  };

  const handleReadMore = (articleId, e) => {
    e.stopPropagation();

    // window.location.href = `/articles/${articleId}`;
  };

  return (
    <div className="news-feed__container">
      {/* News Feed Header */}
      <div className="news-feed__header">
        <h3 className="news-feed__title">Latest News & Updates</h3>
        <a href="#" className="news-feed__view-all">View All</a>
      </div>

      {/* News Cards Container with Arrows */}
      <div className="news-feed__wrapper">
        <button 
          className="nav-arrow left-arrow" 
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div 
          className="news-feed__cards" 
          ref={newsCardsContainerRef}
          onScroll={handleScroll}
        >
          {newsData.map((newsItem) => (
            <div 
              key={newsItem.id} 
              className="news-card" 
              data-article-id={newsItem.id}
              onClick={(e) => handleCardClick(newsItem.id, e)}
            >
              <div className="news-card__image-container">
                <img src={newsItem.image} alt={newsItem.alt} className="news-card__image" />
              </div>
              <div className="news-card__content">
                <h4 className="news-card__title">{newsItem.title}</h4>
                <p className="news-card__description">{newsItem.description}</p>
                <div className="news-card__footer">
                  <span className="news-card__date">{newsItem.date}</span>
                  <button 
                    className="news-card__read-more"
                    onClick={(e) => handleReadMore(newsItem.id, e)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="nav-arrow right-arrow" 
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={currentSlide >= totalSlides - 1}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Horizontal Progress Indicator */}
      <div className="news-feed__progress">
        <div 
          className="progress-bar" 
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};


//this is the jobposting guide on the homepage

const JobPostingGuide = () => {
  return (
    <div className="guide-container">
      <h2 className="guide-title">Hiring Top Tech Talent?</h2>
      <div className="guide-steps">
        <div className="guide-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Create Your Employer Profile</h3>
            <p>Set up your company profile to showcase your brand and attract the right candidates.</p>
          </div>
        </div>
        
        <div className="guide-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Post Your Job Listing</h3>
            <p>Use our simple form to create detailed job postings with requirements, benefits, and salary range.</p>
          </div>
        </div>
        
        <div className="guide-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>AI-Powered Candidate Matching</h3>
            <p>Our system automatically matches you with qualified developers based on your requirements.</p>
          </div>
        </div>
        
        <div className="guide-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Manage Applications</h3>
            <p>Review candidate profiles, schedule interviews, and send offers through our platform.</p>
          </div>
        </div>
      </div>
      
      <div className="guide-cta">
        <div><button className="cta-button"><Link 
            to={"/PostJob"}
          >Post a Job Now
          </Link></button></div>
        <p className="cta-note">Get your first 3 job postings free</p>
      </div>
    </div>
  );
};


const VisionStatement = () => {
  return (
    <div className="vision-container">
      <div className="vision-header">
        <h2 className="vision-title">Our Vision</h2>
        <p className="vision-tagline">Bridging the gap between exceptional talent and innovative companies</p>
      </div>
      
      <div className="vision-content">
        <div className="vision-card">
          <h3>For Developers</h3>
          <p>
            We're creating a platform where tech talent can find meaningful work with companies that value their skills. 
            No more endless job searches - our AI matches you with opportunities that align with your expertise and career goals.
          </p>
        </div>
        
        <div className="vision-card">
          <h3>For Employers</h3>
          <p>
            We help growing companies build their dream engineering teams by connecting them with pre-vetted, 
            highly skilled developers. Our matching algorithm ensures you only see candidates who truly fit your needs.
          </p>
        </div>
        
        <div className="vision-card">
          <h3>Our Technology</h3>
          <p>
            Using advanced AI and machine learning, we're revolutionizing tech recruitment by eliminating bias, 
            reducing hiring time, and ensuring better matches between candidates and companies.
          </p>
        </div>
      </div>
      
      <div className="vision-values">
        <h3>Core Values</h3>
        <div className="values-list">
          <span>Transparency</span>
          <span>Efficiency</span>
          <span>Diversity</span>
          <span>Innovation</span>
          <span>Community</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
