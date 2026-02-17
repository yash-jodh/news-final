import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="loading-wrapper">
    <div className="loading-spinner-custom"></div>
    <p className="loading-text">{text}</p>
  </div>
);

LoadingSpinner.propTypes = {
  text: PropTypes.string,
};

export default LoadingSpinner;