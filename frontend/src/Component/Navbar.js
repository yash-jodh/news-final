import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/business', label: 'Business' },
    { path: '/entertainment', label: 'Entertainment' },
    { path: '/health', label: 'Health' },
    { path: '/science', label: 'Science' },
    { path: '/sports', label: 'Sports' },
    { path: '/anime', label: 'Anime' },
    { path: '/technology', label: 'Technology' },
  ];

  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-custom shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand brand-logo" to="/">
          📰 X-Times
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Nav Links */}
          <ul className="navbar-nav me-auto">
            {navLinks.map(link => (
              <li className="nav-item" key={link.path}>
                <Link
                  className={`nav-link nav-link-custom ${location.pathname === link.path ? 'active-link' : ''}`}
                  to={link.path}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side Controls */}
          <div className="d-flex align-items-center gap-3">

            {/* Dark Mode Toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              <span className="toggle-track">
                <span className="toggle-thumb">
                  {isDark ? '🌙' : '☀️'}
                </span>
              </span>
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="user-menu" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                <img
                  src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName}
                  alt={user.displayName}
                  className="user-avatar"
                  referrerPolicy="no-referrer"
                />
                {showDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-user-info">
                      <img
                        src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName}
                        alt={user.displayName}
                        className="dropdown-avatar"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="dropdown-name">{user.displayName}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                    </div>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-logout" onClick={logout}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn-nav">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;