import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mgnregaService from '../services/mgnregaDataService';
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
      
      console.log('🏠 Home: Fetching districts for', selectedState);
      const data = await mgnregaService.getDistrictsForState(selectedState);
      
      if (data.success) {
        setDistricts(data.districts);
        console.log('✅ Home: Districts loaded', data.districts.length);
      } else {
        setError(data.error || 'Failed to fetch districts');
        console.error('❌ Home: Failed to fetch districts', data.error);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('💥 Home: Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district) => {
    console.log('📍 Home: District selected:', district);
    onDistrictSelect(district);
    // Auto-navigate to dashboard after selection
    setTimeout(() => navigate('/dashboard'), 500);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🏘️ MGNREGA जिला प्रदर्शन ट्रैकर
          </h1>
          <p className="hero-subtitle">
            अपने जिले में MGNREGA का प्रदर्शन देखें - आसान और समझने योग्य तरीके से
          </p>
          <p className="hero-subtitle-english">
            Track your district's MGNREGA performance - Simple and Easy to Understand
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">26</span>
              <span className="stat-label">Districts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">522M+</span>
              <span className="stat-label">Employment Generated</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">16.4B+</span>
              <span className="stat-label">Person Days</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">60%</span>
              <span className="stat-label">Women Participation</span>
            </div>
          </div>
          <div className="demo-notice">
            <span className="demo-badge">🏛️ Official Government Data</span>
            <p>Real MGNREGA statistics from Government MIS System FY 2025-26</p>
          </div>
        </div>
      </div>

      {/* District Selection Section */}
      <div className="selector-section">
        <div className="section-header">
          <h2 className="selector-title">
            🏘️ अपना जिला चुनें / Select Your District
          </h2>
          <p className="selector-subtitle">
            {selectedState} के सभी 26 जिलों का वास्तविक MGNREGA डेटा देखें
          </p>
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-content">
              <h3>जिले लोड हो रहे हैं...</h3>
              <p>Loading districts with real government data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>डेटा लोड नहीं हो सका / Failed to Load Data</h3>
            <p className="error-message">{error}</p>
            <button onClick={fetchDistricts} className="retry-button">
              🔄 फिर से कोशिश करें / Try Again
            </button>
          </div>
        )}

        {!loading && !error && districts.length > 0 && (
          <>
            <div className="districts-header">
              <div className="districts-count">
                <span className="count-number">{districts.length}</span>
                <span className="count-label">Districts Available</span>
              </div>
              <div className="data-freshness">
                <span className="freshness-indicator">🟢</span>
                <span>Live Data</span>
              </div>
            </div>
            
            <div className="district-grid">
              {districts.map((district) => (
                <div
                  key={district}
                  className={`district-card ${selectedDistrict === district ? 'selected' : ''}`}
                  onClick={() => handleDistrictSelect(district)}
                >
                  <div className="district-icon">🏛️</div>
                  <div className="district-content">
                    <h3 className="district-name">{district}</h3>
                    <p className="district-subtitle">जिला / District</p>
                  </div>
                  <div className="district-arrow">→</div>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedDistrict && (
          <div className="selection-summary">
            <div className="selected-info">
              <div className="selected-icon">✅</div>
              <div className="selected-content">
                <h4>चुना गया जिला / Selected District</h4>
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

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card primary-action">
          <div className="action-icon">📊</div>
          <div className="action-content">
            <h3>जिलों की तुलना करें / Compare Districts</h3>
            <p>सभी जिलों का प्रदर्शन एक साथ देखें और बेहतर जिलों से सीखें</p>
          </div>
          <button 
            onClick={() => navigate('/comparison')} 
            className="action-button"
          >
            Compare Now →
          </button>
        </div>

        <div className="action-card secondary-action">
          <div className="action-icon">📈</div>
          <div className="action-content">
            <h3>Real-Time Analytics</h3>
            <p>Government verified data updated in real-time from official sources</p>
          </div>
          <div className="action-stats">
            <span className="mini-stat">📅 FY 2025-26</span>
            <span className="mini-stat">🏛️ Official MIS</span>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="info-section">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h3>MGNREGA क्या है? / What is MGNREGA?</h3>
            <p>
              महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (MGNREGA) 
              भारत में हर ग्रामीण परिवार को साल में 100 दिन का गारंटीशुदा रोजगार देता है।
            </p>
            <p className="english-text">
              The Mahatma Gandhi National Rural Employment Guarantee Act provides 
              guaranteed 100 days of employment per year to every rural household in India.
            </p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>यहाँ आप क्या देख सकते हैं? / What can you see?</h3>
            <ul className="info-list">
              <li>👥 Employment provided to households</li>
              <li>📅 Average days of work provided</li>
              <li>👩 Women's participation rates</li>
              <li>🏗️ Work completion statistics</li>
              <li>📈 Performance trends over time</li>
            </ul>
          </div>

          <div className="info-card">
            <div className="info-icon">🔍</div>
            <h3>डेटा कहाँ से आता है? / Data Source</h3>
            <p>
              यह डेटा भारत सरकार के आधिकारिक MGNREGA Management Information System 
              से सीधे आता है और वास्तविक समय में अपडेट होता है।
            </p>
            <p className="english-text">
              Data comes directly from the Government of India's official 
              MGNREGA MIS and is updated in real-time.
            </p>
            <div className="data-badges">
              <span className="badge official">🏛️ Government Verified</span>
              <span className="badge realtime">⚡ Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
