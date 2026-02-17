import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{ marginTop: '120px' }}>
          <div className="error-icon">⚠️</div>
          <h4>Something went wrong</h4>
          <p>The application encountered an unexpected error.</p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginBottom: '16px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontSize: '0.8rem', marginBottom: '8px' }}>
                Error details
              </summary>
              <pre style={{ fontSize: '0.75rem', overflow: 'auto', padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="retry-btn-main" onClick={this.handleReset}>
              Try Again
            </button>
            <a href="/" className="empty-cta">Go Home</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;