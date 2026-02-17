import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} — X-Times`;
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  const buildUrl = (pageNum) => {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    if (props.category === 'anime') {
      return `https://newsapi.org/v2/everything?q=anime&apiKey=${apiKey}&page=${pageNum}&pageSize=${props.pageSize}`;
    }
    return `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${pageNum}&pageSize=${props.pageSize}`;
  };

  const updateNews = async () => {
    try {
      props.setProgress(30);
      setError(null);

      const apiKey = process.env.REACT_APP_NEWS_API_KEY;
      if (!apiKey) throw new Error('API key is missing. Please add REACT_APP_NEWS_API_KEY to your .env file');

      setLoading(true);
      props.setProgress(60);

      const response = await fetch(buildUrl(1));
      if (!response.ok) {
        if (response.status === 401) throw new Error('Invalid API key. Please check your credentials.');
        if (response.status === 429) throw new Error('Too many requests. Please try again later.');
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);

      setArticles(data.articles || []);
      setTotalResults(data.totalResults || 0);
      setPage(1);
      setLoading(false);
      props.setProgress(100);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      props.setProgress(100);
    }
  };

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;
      const response = await fetch(buildUrl(nextPage));
      if (!response.ok) throw new Error('Failed to load more articles');
      const data = await response.json();
      if (data.articles) {
        setArticles(prev => [...prev, ...data.articles]);
        setPage(nextPage);
        setTotalResults(data.totalResults || 0);
      }
    } catch (err) {
      console.error('fetchMoreData error:', err);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h4>Failed to Load News</h4>
        <p>{error}</p>
        <button className="retry-btn-main" onClick={updateNews}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <h1 className="page-main-title">
        {capitalizeFirstLetter(props.category)} Headlines
      </h1>

      {loading && (
        <div className="loading-wrapper">
          <div className="loading-spinner-custom"></div>
          <p className="loading-text">Loading latest news...</p>
        </div>
      )}

      {!loading && (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalResults}
          loader={
            <div className="loading-wrapper">
              <div className="loading-spinner-custom"></div>
              <p className="loading-text">Loading more articles...</p>
            </div>
          }
          endMessage={
            articles.length > 0 && (
              <p className="scroll-end-msg">
                You've seen all {articles.length} articles ✓
              </p>
            )
          }
        >
          {articles.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h2>No Articles Found</h2>
              <p>No news available for this category right now.</p>
            </div>
          ) : (
            <div className="row">
              {articles.map((article, index) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 col-12"
                  key={`${article.url}-${index}`}
                  style={{ animationDelay: `${(index % 12) * 0.05}s` }}
                >
                  <NewsItem
                    title={article.title || 'Untitled'}
                    description={article.description || ''}
                    imageUrl={article.urlToImage}
                    newsUrl={article.url}
                    author={article.author}
                    date={article.publishedAt}
                    source={article.source?.name || 'Unknown'}
                  />
                </div>
              ))}
            </div>
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

News.defaultProps = {
  country: 'us',
  pageSize: 12,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired,
};

export default News;