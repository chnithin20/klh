import React from 'react';

const Loader: React.FC<{ text: string; sub: string }> = ({ text, sub }) => (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <div className="loading-text">{text}</div>
    <div className="loading-sub">{sub}</div>
  </div>
);

export default Loader;
