import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem('x-times-bookmarks') || '[]');
      setBookmarks(saved);
    }
  }, [user]);

  const removeBookmark = (url) => {
    const updated = bookmarks.filter(b => b.url !== url);
    setBookmarks(updated);
    localStorage.setItem('x-times-bookmarks', JSON.stringify(updated));
  };

  const clearAll = () => {
    setBookmarks([]);
    localStorage.removeItem('x-times-bookmarks');
  };

  if (!user) {
    return (
      <div className="empty-state" style={{ marginTop: '90px' }}>
        <div className="empty-icon">🔒</div>
        <h2>Sign in to view bookmarks</h2>
        <p>Save articles to read them later.</p>
        <Link to="/login" className="empty-cta">Sign In</Link>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: '90px' }}>
        <div className="empty-icon">🏷️</div>
        <h2>No bookmarks yet</h2>
        <p>Click the bookmark button on any article to save it here.</p>
        <Link to="/" className="empty-cta">Browse News</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '90px', paddingBottom: '40px' }}>
      <div className="page-header">
        <h1 className="page-title">🔖 Saved Articles</h1>
        <div className="page-header-right">
          <span className="bookmark-count">{bookmarks.length} saved</span>
          <button className="clear-all-btn" onClick={clearAll}>
            Clear All
          </button>
        </div>
      </div>

      <div className="row">
        {bookmarks.map((article, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={`${article.url}-${index}`}>
            <div className="news-card bookmark-card">
              <div className="card-img-wrapper">
                <img
                  src={article.imageUrl || `https://placehold.co/400x200/1a1a2e/ffffff?text=${encodeURIComponent(article.source || 'News')}`}
                  alt={article.title}
                  className="card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/400x200/1a1a2e/ffffff?text=News`;
                  }}
                />
                <span className="source-badge">{article.source}</span>
                <button
                  className="bookmark-btn bookmarked"
                  onClick={() => removeBookmark(article.url)}
                  title="Remove bookmark"
                >
                  🔖
                </button>
              </div>
              <div className="card-body-custom">
                <h5 className="card-headline">
                  {article.title?.length > 80 ? article.title.slice(0, 80) + '...' : article.title}
                </h5>
                <p className="card-desc">
                  {article.description?.length > 100
                    ? article.description.slice(0, 100) + '...'
                    : article.description || 'No description available.'}
                </p>
                <div className="card-meta">
                  <span className="meta-date">
                    📅 {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="card-actions">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-btn"
                  >
                    Read Article
                  </a>
                  <button
                    className="remove-btn"
                    onClick={() => removeBookmark(article.url)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;