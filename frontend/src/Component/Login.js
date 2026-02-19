import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithGoogle, authError } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');

  // Show current domain to help debug Firebase authorized domains
  useEffect(() => {
    setCurrentDomain(window.location.hostname);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // signInWithRedirect doesn't return immediately - redirect happens in AuthContext
    } catch (err) {
      setIsLoading(false);
      console.error('Login button error:', err);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">📰</div>
          <h1 className="login-title">X-Times</h1>
          <p className="login-subtitle">Stay informed with the world's top headlines</p>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">🔖</span>
            <span>Bookmark your favorite articles</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span>AI-powered article summaries</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌙</span>
            <span>Dark mode & personalization</span>
          </div>
        </div>

        {/* Show current domain to help user debug Firebase */}
        <div style={{
          background: 'rgba(255,193,7,0.1)',
          border: '1px solid rgba(255,193,7,0.3)',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '16px',
          fontSize: '0.85rem'
        }}>
          <strong>Current domain:</strong> <code>{currentDomain}</code>
          <br />
          <small style={{ opacity: 0.8 }}>
            Add this exact domain to Firebase → Authentication → Settings → Authorized domains
          </small>
        </div>

        {authError && (
          <div className="login-error">
            {authError}
            <br />
            <small style={{ marginTop: '8px', display: 'block', opacity: 0.9 }}>
              Make sure <code>{currentDomain}</code> is added to Firebase Authorized Domains
            </small>
          </div>
        )}

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-loading">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Redirecting to Google...
            </span>
          ) : (
            <>
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p className="login-footer">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;