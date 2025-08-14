import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Auth from './Auth';
import LoadingBar from "react-top-loading-bar";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import React, { useState } from 'react';
import Navbar from './Component/Navbar';
import News from './Component/News';

const App = () => {
  const pageSize = 6;
  const [progress, setProgress] = useState([0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div>
      <Router>
        <Navbar />
        <LoadingBar color="#f11946" progress={progress} />
        <Routes>
          <Route exact path="/" element={<News setProgress={setProgress} key="general" pageSize={pageSize} country="us" category="general" />} />
          <Route exact path="/bussiness" element={<News setProgress={setProgress} key="business" pageSize={pageSize} country="us" category="business" />} />
          {/* <Route exact path="/entertainment" element={<News setProgress={setProgress} key="entertainment" pageSize={pageSize} country="us" category="entertainment" />} />
          <Route exact path="/health" element={<News setProgress={setProgress} key="health" pageSize={pageSize} country="us" category="health" />} />
          <Route exact path="/science" element={<News setProgress={setProgress} key="science" pageSize={pageSize} country="us" category="science" />} />
          <Route exact path="/sports" element={<News setProgress={setProgress} key="sports" pageSize={pageSize} country="us" category="sports" />} />
          <Route exact path="/anime" element={<News setProgress={setProgress} key="anime" pageSize={pageSize} country="us" category="anime" />} /> */}
          <Route exact path="/technology" element={<News setProgress={setProgress} key="technology" pageSize={pageSize} country="us" category="technology" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
