import React, { useState, useEffect } from 'react';

// Backend URL — switches automatically between dev and production
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const SummaryModal = ({ article, onClose }) => {
  const [summary, setSummary]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [generated, setGenerated] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    setSummary([]);
    setGenerated(false);

    try {
      // Call YOUR backend — not Gemini directly
      // API key never leaves the server
      const response = await fetch(`${BACKEND_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:       article.title,
          description: article.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      if (!data.bullets || data.bullets.length === 0) {
        throw new Error('No summary returned. Please try again.');
      }

      setSummary(data.bullets);
      setGenerated(true);

    } catch (err) {
      // Handle case where backend isn't running
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSummary();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="summary-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header-custom">
          <div className="modal-title-row">
            <span className="ai-badge">✨ Gemini AI Summary</span>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <p className="modal-source-badge">{article.source}</p>
        </div>

        {/* Article title */}
        <div className="modal-article-title">
          <h3>{article.title}</h3>
        </div>

        {/* Body */}
        <div className="modal-body-custom">

          {loading && (
            <div className="summary-loading">
              <div className="ai-thinking">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <p>Gemini is reading the article...</p>
            </div>
          )}

          {error && !loading && (
            <div className="summary-error">
              <p>⚠️ {error}</p>
              <button className="retry-btn" onClick={generateSummary}>
                Try Again
              </button>
            </div>
          )}

          {generated && !loading && !error && (
            <div className="summary-result">
              <div className="summary-label">📝 Key Points</div>
              <ul className="summary-bullets">
                {summary.map((point, i) => (
                  <li key={i} className="summary-bullet-item">{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer-custom">
          <a
            href={article.newsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="read-full-btn"
          >
            Read Full Article →
          </a>
          {generated && (
            <button
              className="regenerate-btn"
              onClick={generateSummary}
              disabled={loading}
            >
              ↻ Regenerate
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SummaryModal;