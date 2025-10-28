import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>🏘️ MGNREGA ट्रैकर</h4>
          <p>Making government data accessible to rural India</p>
          <p>सरकारी डेटा को ग्रामीण भारत के लिए सुलभ बनाना</p>
        </div>
        
        <div className="footer-section">
          <h4>📊 डेटा स्रोत / Data Source</h4>
          <p>Government of India</p>
          <p>data.gov.in Portal</p>
          <p>🇮🇳 भारत सरकार</p>
        </div>
        
        <div className="footer-section">
          <h4>ℹ️ जानकारी / Information</h4>
          <p>Real-time MGNREGA data</p>
          <p>वास्तविक समय MGNREGA डेटा</p>
          <p>Updated regularly</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 MGNREGA District Tracker | Made with ❤️ for Rural India</p>
        <p>🧪 Demo Version - Sample data for demonstration</p>
      </div>
    </footer>
  );
};

export default Footer;
