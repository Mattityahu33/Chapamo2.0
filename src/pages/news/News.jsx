import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiClock, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import './News.css';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';

const buildNewsUrl = () => {
  const params = new URLSearchParams({
    q: '(jobs OR careers OR hiring OR work) AND Zambia',
    lang: 'en',
    country: 'zm',
    max: '12',
    sortby: 'publishedAt',
    apikey: NEWS_API_KEY,
  });

  return `https://gnews.io/api/v4/search?${params.toString()}`;
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const News = () => {
  const [articles, setArticles] = useState([]);
  const [visibleItems, setVisibleItems] = useState(6);
  const [loading, setLoading] = useState(Boolean(NEWS_API_KEY));
  const [error, setError] = useState('');

  const fetchNews = async () => {
    if (!NEWS_API_KEY) {
      setLoading(false);
      setError('Add VITE_NEWS_API_KEY to load live news on this page.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(buildNewsUrl());
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.errors?.[0] || 'Unable to load news right now.');
      }

      const normalizedArticles = Array.isArray(data.articles)
        ? data.articles.map((article, index) => ({
            id: `${article.url || article.title}-${index}`,
            title: article.title,
            description: article.description,
            image: article.image || FALLBACK_IMAGE,
            source: article.source?.name || 'GNews',
            publishedAt: article.publishedAt,
            url: article.url,
          }))
        : [];

      setArticles(normalizedArticles);
      if (!normalizedArticles.length) {
        setError('No recent articles matched the current feed.');
      }
    } catch (fetchError) {
      console.error('Error fetching news:', fetchError);
      setArticles([]);
      setError(fetchError.message || 'Unable to load news right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const featuredArticle = articles[0];
  const visibleArticles = useMemo(() => articles.slice(1, visibleItems), [articles, visibleItems]);

  return (
    <div className="news-page">
      <section className="news-hero">
        <div className="container news-hero__content">
          <span className="badge badge-primary">Editorial Feed</span>
          <h1>Career, hiring, and workplace news in one premium briefing.</h1>
          <p>
            Stay current with public reporting across jobs, hiring trends, and professional
            development. The feed is frontend-powered and ready for an API key swap later.
          </p>

          <div className="news-hero__actions">
            <button type="button" className="btn btn-primary" onClick={fetchNews} disabled={loading}>
              <FiRefreshCw className={loading ? 'news-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh Feed'}
            </button>
            <div className="news-hero__meta">
              <span><FiClock /> Live frontend fetch</span>
              <span><FiArrowUpRight /> Opens source articles externally</span>
            </div>
          </div>
        </div>
      </section>

      <section className="news-content">
        <div className="container">
          {loading ? (
            <div className="news-grid">
              {[...Array(6)].map((_, index) => (
                <article key={index} className="news-card news-card--skeleton">
                  <div className="skeleton news-skeleton__image" />
                  <div className="news-card__body">
                    <div className="skeleton news-skeleton__meta" />
                    <div className="skeleton news-skeleton__title" />
                    <div className="skeleton news-skeleton__text" />
                    <div className="skeleton news-skeleton__text short" />
                  </div>
                </article>
              ))}
            </div>
          ) : error && !articles.length ? (
            <div className="news-message news-message--error">
              <h2>News feed unavailable</h2>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {error && <div className="news-inline-note">{error}</div>}

              {featuredArticle && (
                <article className="news-featured card">
                  <div className="news-featured__image-wrap">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="news-featured__image"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="news-featured__content">
                    <span className="badge badge-info">{featuredArticle.source}</span>
                    <h2>{featuredArticle.title}</h2>
                    <p>{featuredArticle.description || 'Read the full article for more context.'}</p>
                    <div className="news-featured__footer">
                      <span>{formatDate(featuredArticle.publishedAt)}</span>
                      <a
                        href={featuredArticle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                      >
                        Read Article
                        <FiExternalLink />
                      </a>
                    </div>
                  </div>
                </article>
              )}

              <div className="news-grid">
                {visibleArticles.map((newsItem) => (
                  <article className="news-card card" key={newsItem.id}>
                    <div className="news-card__media">
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="news-card__image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <div className="news-card__body">
                      <div className="news-card__meta">
                        <span>{newsItem.source}</span>
                        <span>{formatDate(newsItem.publishedAt)}</span>
                      </div>
                      <h3>{newsItem.title}</h3>
                      <p>{newsItem.description || 'Open the article to continue reading.'}</p>
                      <a
                        href={newsItem.url}
                        className="news-card__link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open source
                        <FiExternalLink />
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {visibleItems < articles.length && (
                <div className="news-load-more">
                  <button type="button" className="btn btn-primary" onClick={() => setVisibleItems((prev) => prev + 3)}>
                    Load More News
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
