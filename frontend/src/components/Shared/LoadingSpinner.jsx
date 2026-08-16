
import React from 'react';

const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-logo">CHRONALCHEMY</div>
        <div className="loading-text">Loading...</div>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
