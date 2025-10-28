import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ selectedState, selectedDistrict, onDistrictSelect }) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistricts();
  }, [selectedState]);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/districts/${encodeURIComponent(selectedState)}`);
      const data = await response.json();
      
      if (data.success) {
        setDistricts(data.districts);
      } else {
        setError(data.message || 'Failed to fetch districts');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching districts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district) => {
    onDistrictSelect(district);
    // Auto-navigate to dashboard after selection
    setTimeout(() => navigate('/dashboard'), 500);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          🏘️ MGNREGA जिला प्रदर्शन ट्रैकर
        </h1>
        <p className="hero-subtitle">
          अपने जिले में MGNREGA का प्रदर्शन देखें - आसान और समझने योग्य तरीके से
        </p>
        <p className="hero-subtitle-english">
          Track your district's MGNREGA performance - Simple and Easy to Understand
        </p>
        <div className="demo-notice">
  <span className="demo-badge">✅ वास्तविक डेटा / Real Data</span>
  <p>Showing all 26 districts of {selectedState} with official MGNREGA statistics</p>
</div>
      </div>

      {/* District Selection Section */}
      <div className="selector-section">
        <h2 className="selector-title">
          🏘️ अपना जिला चुनें / Select Your District
        </h2>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>जिले लोड हो रहे हैं... / Loading districts...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h3>⚠️ डेटा लोड नहीं हो सका / Failed to Load Data</h3>
            <p>{error}</p>
            <button onClick={fetchDistricts} className="retry-button">
              🔄 फिर से कोशिश करें / Try Again
            </button>
          </div>
        )}

        {!loading && !error && districts.length > 0 && (
          <div className="district-grid">
            {districts.map((district) => (
              <button
                key={district}
                className={`district-card ${selectedDistrict === district ? 'selected' : ''}`}
                onClick={() => handleDistrictSelect(district)}
              >
                <div className="district-icon">🏛️</div>
                <div className="district-name">{district}</div>
                <div className="district-subtitle">जिला / District</div>
              </button>
            ))}
          </div>
        )}

        {selectedDistrict && (
          <div className="selection-summary">
            <div className="selected-info">
              <span className="checkmark">✅</span>
              <div>
                <p><strong>चुना गया जिला / Selected District:</strong></p>
                <p className="selected-district">{selectedDistrict}, {selectedState}</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="view-dashboard-btn"
              >
                📊 प्रदर्शन देखें / View Performance
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="info-section">
        <div className="info-card">
          <h3>🎯 MGNREGA क्या है? / What is MGNREGA?</h3>
          <p>
            महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (MGNREGA) 
            भारत में हर ग्रामीण परिवार को साल में 100 दिन का गारंटीशुदा रोजगार देता है।
          </p>
          <p className="english-text">
            The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) 
            provides guaranteed 100 days of employment per year to every rural household in India.
          </p>
        </div>
        
        <div className="info-card">
          <h3>📊 यहाँ आप क्या देख सकते हैं? / What can you see here?</h3>
          <ul>
            <li>👥 कितने घरों को रोजगार मिला / Employment provided to households</li>
            <li>📅 औसतन कितने दिन काम मिला / Average days of work provided</li>
            <li>👩 महिलाओं की भागीदारी / Women's participation</li>
            <li>🏗️ काम पूरा होने की दर / Work completion rate</li>
            <li>📈 समय के साथ प्रदर्शन में बदलाव / Performance trends over time</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>🔍 यह जानकारी कैसे मिलती है? / How do we get this information?</h3>
          <p>
            यह डेटा भारत सरकार के आधिकारिक MGNREGA रिपोर्ट्स से आता है। 
            हम इसे आसान तरीके से दिखाते हैं ताकि आम लोग भी समझ सकें।
          </p>
          <p className="english-text">
            This data comes from official Government of India MGNREGA reports. 
            We present it in an easy-to-understand format for common people.
          </p>
        </div>
      </div>

      {/* Action Section */}
      <div className="action-section">
        <div className="action-card">
          <h3>📊 अधिक जानकारी / More Information</h3>
          <p>सभी जिलों की तुलना करें और बेहतर प्रदर्शन वाले जिलों से सीखें।</p>
          <p>Compare all districts and learn from better performing areas.</p>
          <button 
            onClick={() => navigate('/comparison')} 
            className="comparison-button"
          >
            📈 जिलों की तुलना करें / Compare Districts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
