import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import LoadingBar from 'react-top-loading-bar';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Component/Navbar';
import News from './Component/News';
import Login from './Component/Login';
import Bookmarks from './Component/Bookmarks';
import ErrorBoundary from './Component/ErrorBoundary';

const PAGE_SIZE = 12;

const newsRoutes = [
  { path: '/',             category: 'general' },
  { path: '/business',    category: 'business' },
  { path: '/entertainment', category: 'entertainment' },
  { path: '/health',      category: 'health' },
  { path: '/science',     category: 'science' },
  { path: '/sports',      category: 'sports' },
  { path: '/anime',       category: 'anime' },
  { path: '/technology',  category: 'technology' },
];

const App = () => {
  const [progress, setProgress] = useState(0);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Navbar />
            <LoadingBar
              color="#6366f1"
              progress={progress}
              height={3}
              onLoaderFinished={() => setProgress(0)}
            />
            <Routes>
              {newsRoutes.map(({ path, category }) => (
                <Route
                  key={category}
                  path={path}
                  element={
                    <News
                      setProgress={setProgress}
                      pageSize={PAGE_SIZE}
                      country="us"
                      category={category}
                    />
                  }
                />
              ))}
              <Route path="/login"     element={<Login />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route
                path="*"
                element={
                  <div className="not-found">
                    <div className="not-found-content">
                      <h1>404</h1>
                      <p>Page not found</p>
                      <a href="/" className="read-btn">Go Home</a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;