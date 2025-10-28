import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceChart from '../components/charts/PerformanceChart';
import './Dashboard.css';

const Dashboard = ({ selectedState, selectedDistrict }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDistrict) {
      navigate('/');
      return;
    }
    
    fetchPerformanceData();
  }, [selectedState, selectedDistrict, navigate]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/performance/${encodeURIComponent(selectedState)}/${encodeURIComponent(selectedDistrict)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.performance);
      } else {
        setError(result.error || 'Failed to load performance data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceIcon = (score) => {
    if (score >= 75) return '🟢';
    if (score >= 50) return '🟡';
    return '🔴';
  };

  const getHindiStatus = (score) => {
    if (score >= 75) return 'बहुत अच्छा / Excellent';
    if (score >= 50) return 'ठीक है / Good';
    return 'सुधार चाहिए / Needs Improvement';
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>प्रदर्शन डेटा लोड हो रहा है... / Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <h2>⚠️ डेटा लोड नहीं हो सका / Failed to Load Data</h2>
          <p>Error: {error}</p>
          <button onClick={fetchPerformanceData} className="retry-button">
            🔄 फिर से कोशिश करें / Try Again
          </button>
          <button onClick={() => navigate('/')} className="back-button">
            ⬅️ वापस जाएं / Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <h2>📊 कोई डेटा उपलब्ध नहीं / No Data Available</h2>
          <button onClick={() => navigate('/')} className="back-button">
            ⬅️ जिला बदलें / Change District
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <button onClick={() => navigate('/')} className="back-button">
          ⬅️ वापस / Back
        </button>
        <div className="header-info">
          <h1>📊 {selectedDistrict} का प्रदर्शन / Performance</h1>
          <p className="state-info">{selectedState}</p>
          <p className="last-updated">
            अंतिम अपडेट / Last Updated: {new Date().toLocaleDateString('hi-IN')}
          </p>
        </div>
      </div>

<div className="data-source-indicator">
  <div className="real-data-badge">
    <span className="badge-icon">✅</span>
    <div className="badge-content">
      <h4>वास्तविक डेटा / Real Data</h4>
      <p>Official MGNREGA Statistics</p>
      <p>आधिकारिक MGNREGA आंकड़े</p>
    </div>
  </div>
</div>

      {/* Key Metrics Cards */}
      <div className="performance-dashboard">
        {/* Employment Generation */}
        <div className="metric-card employment">
          <div className="metric-header">
            <span className="icon">👥</span>
            <div>
              <h3>रोजगार मिला</h3>
              <p className="metric-subtitle">Employment Provided</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{data.employmentGenerated.toLocaleString('hi-IN')}</span>
            <span className="label">घर / Households</span>
          </div>
          <div className="metric-status">
            {getPerformanceIcon(data.workCompletionRate)}
            <span>{getHindiStatus(data.workCompletionRate)}</span>
          </div>
        </div>

        {/* Work Completion */}
        <div className="metric-card work-completion">
          <div className="metric-header">
            <span className="icon">🏗️</span>
            <div>
              <h3>काम पूरा हुआ</h3>
              <p className="metric-subtitle">Work Completed</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{data.workCompletionRate}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${data.workCompletionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Average Days */}
        <div className="metric-card avg-days">
          <div className="metric-header">
            <span className="icon">📅</span>
            <div>
              <h3>औसत दिन</h3>
              <p className="metric-subtitle">Average Days</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{data.avgDaysPerHousehold}</span>
            <span className="label">दिन प्रति घर / Days per Household</span>
          </div>
          <div className="comparison">
            <span>लक्ष्य / Target: 100 दिन / days</span>
            <div className="target-progress">
              <div 
                className="target-fill" 
                style={{ width: `${Math.min(100, data.avgDaysPerHousehold)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Women Participation */}
        <div className="metric-card women">
          <div className="metric-header">
            <span className="icon">👩</span>
            <div>
              <h3>महिला भागीदारी</h3>
              <p className="metric-subtitle">Women Participation</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{data.womenParticipation}%</span>
          </div>
          <div className="metric-status">
            {data.womenParticipation >= 50 ? '🟢 अच्छा / Good' : '🟡 बढ़ाएं / Increase'}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <PerformanceChart data={data} />

      {/* Summary Card */}
      <div className="summary-card">
        <h3>📋 सारांश / Summary</h3>
        <div className="summary-content">
          <div className="summary-row">
            <span>🏠</span>
            <span><strong>{data.employmentGenerated.toLocaleString('hi-IN')}</strong> घरों को रोजगार / households employed</span>
          </div>
          <div className="summary-row">
            <span>📊</span>
            <span>कुल <strong>{data.personDaysGenerated.toLocaleString('hi-IN')}</strong> व्यक्ति-दिन काम / person-days of work</span>
          </div>
          <div className="summary-row">
            <span>👩‍🏭</span>
            <span><strong>{data.womenParticipation}%</strong> महिला भागीदारी / women participation</span>
          </div>
          <div className="summary-row">
            <span>🏗️</span>
            <span><strong>{data.workCompletionRate}%</strong> काम पूरा / work completion</span>
          </div>
        </div>
        {data.summary && data.summary.note && (
          <div className="demo-note">
            <span className="demo-badge">🧪 Demo</span>
            <p>{data.summary.note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
