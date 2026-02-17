import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import SummaryModal from './SummaryModal';

const NewsItem = ({ title, description, imageUrl, newsUrl, author, date, source }) => {
  const [imgError, setImgError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);
  const { user } = useAuth();

  const fallbackImage = `https://placehold.co/400x200/1a1a2e/ffffff?text=${encodeURIComponent(source || 'News')}`;

  // Check if already bookmarked
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('x-times-bookmarks') || '[]');
    setBookmarked(bookmarks.some(b => b.url === newsUrl));
  }, [newsUrl]);

  const handleBookmark = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to bookmark articles!');
      return;
    }

    const bookmarks = JSON.parse(localStorage.getItem('x-times-bookmarks') || '[]');
    const article = { title, description, imageUrl, url: newsUrl, author, date, source };

    let updated;
    if (bookmarked) {
      updated = bookmarks.filter(b => b.url !== newsUrl);
    } else {
      updated = [article, ...bookmarks];
      setBookmarkAnim(true);
      setTimeout(() => setBookmarkAnim(false), 600);
    }

    localStorage.setItem('x-times-bookmarks', JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const truncate = (text, len) => {
    if (!text) return '';
    return text.length > len ? text.slice(0, len) + '...' : text;
  };

  return (
    <>
      <div className="news-card">
        {/* Image */}
        <div className="card-img-wrapper">
          <img
            src={imgError || !imageUrl ? fallbackImage : imageUrl}
            alt={title}
            className="card-image"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          {/* Source Badge */}
          <span className="source-badge">{truncate(source, 20)}</span>
          {/* Bookmark Button */}
          <button
            className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''} ${bookmarkAnim ? 'pop' : ''}`}
            onClick={handleBookmark}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
            title={bookmarked ? 'Remove bookmark' : 'Save article'}
          >
            {bookmarked ? '🔖' : '🏷️'}
          </button>
        </div>

        {/* Body */}
        <div className="card-body-custom">
          <h5 className="card-headline">{truncate(title, 80)}</h5>
          <p className="card-desc">{truncate(description, 100)}</p>

          <div className="card-meta">
            <span className="meta-author">
              ✍️ {truncate(author || 'Unknown', 25)}
            </span>
            <span className="meta-date">
              📅 {formatDate(date)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="card-actions">
            <a
              href={newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="read-btn"
            >
              Read Article
            </a>
            <button
              className="summarize-btn"
              onClick={() => setShowSummary(true)}
              title="Generate AI summary"
            >
              🤖 Summarize
            </button>
          </div>
        </div>
      </div>

      {/* AI Summary Modal */}
      {showSummary && (
        <SummaryModal
          article={{ title, description, source, newsUrl }}
          onClose={() => setShowSummary(false)}
        />
      )}
    </>
  );
};

NewsItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  newsUrl: PropTypes.string.isRequired,
  author: PropTypes.string,
  date: PropTypes.string,
  source: PropTypes.string.isRequired
};

NewsItem.defaultProps = {
  description: 'No description available.',
  imageUrl: null,
  author: 'Unknown',
  date: new Date().toISOString()
};

export default NewsItem;