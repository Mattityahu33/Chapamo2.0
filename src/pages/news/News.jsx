import React, { useState, useEffect } from 'react';
import './News.css'; // We'll create this CSS file next

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);

  // Simulate fetching news data (replace with your actual API call)
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // In a real app, you would fetch from your API here
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            title: "New Feature Release: Enhanced Analytics Dashboard",
            description: "We've just launched our new analytics dashboard with real-time data visualization and customizable reports.",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            date: "June 10, 2023",
            readMoreLink: "#"
          },
          {
            id: 2,
            title: "Company Wins Industry Innovation Award",
            description: "Our team has been recognized for groundbreaking work in AI-powered solutions at the Tech Innovators Summit.",
            imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            date: "May 28, 2023",
            readMoreLink: "#"
          },
          {
            id: 3,
            title: "Upcoming Webinar: Future of Digital Transformation",
            description: "Join our experts as they discuss emerging trends and strategies for successful digital transformation.",
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            date: "May 15, 2023",
            readMoreLink: "#"
          },
          {
            id: 4,
            title: "Partnership Announcement: Collaboration with Tech Giant",
            description: "We're excited to announce our strategic partnership to deliver cutting-edge solutions to enterprises worldwide.",
            imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            date: "April 30, 2023",
            readMoreLink: "#"
          },
          {
            id: 5,
            title: "Community Initiative: Supporting STEM Education",
            description: "Our new program aims to provide resources and mentorship to underprivileged students pursuing STEM careers.",
            imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            date: "April 12, 2023",
            readMoreLink: "#"
          }
        ];
        
        setNewsData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const loadMore = () => {
    setVisibleItems(prev => prev + 3);
  };

  if (loading) {
    return (
      <div className="news-loading">
        <div className="spinner"></div>
        <p>Loading news...</p>
      </div>
    );
  }

  return (
    <section className="news-section">
      <div className="news-header">
        <h2>Latest News & Updates</h2>
        <p>Stay informed with our most recent announcements and stories</p>
      </div>
      
      <div className="news-container">
        {Array.isArray(newsData) && newsData.slice(0, visibleItems).map((newsItem) => (
          <div className="news-card" key={newsItem.id}>
            <div className="news-image-container">
              <img 
                src={newsItem.imageUrl} 
                alt={newsItem.title} 
                className="news-image"
                loading="lazy"
              />
              <div className="news-date">{newsItem.date}</div>
            </div>
            <div className="news-content">
              <h3 className="news-title">{newsItem.title}</h3>
              <p className="news-description">{newsItem.description}</p>
              <a 
                href={newsItem.readMoreLink} 
                className="read-more-btn"
                aria-label={`Read more about ${newsItem.title}`}
              >
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {visibleItems < newsData.length && (
        <div className="load-more-container">
          <button onClick={loadMore} className="load-more-btn">
            Load More News
          </button>
        </div>
      )}
    </section>
  );
};

export default News;