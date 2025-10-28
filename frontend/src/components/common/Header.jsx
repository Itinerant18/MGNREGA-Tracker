import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🏘️</span>
          <div className="logo-text">
            <h1>MGNREGA ट्रैकर</h1>
            <p>District Performance Tracker</p>
          </div>
        </div>
        <div className="header-info">
          <span className="badge">🇮🇳 भारत सरकार</span>
          <span className="badge">Government of India</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
