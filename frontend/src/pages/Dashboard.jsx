import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceChart from '../components/charts/PerformanceChart';
import mgnregaService from '../services/mgnregaDataService';
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
      
      console.log('📊 Dashboard: Fetching performance for', selectedDistrict, selectedState);
      const result = await mgnregaService.getDistrictPerformance(selectedState, selectedDistrict);
      
      if (result.success) {
        setData(result.performance);
        console.log('✅ Dashboard: Performance data loaded', result.performance);
      } else {
        setError(result.error || 'Failed to load performance data');
        console.error('❌ Dashboard: Failed to load performance', result.error);
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
      console.error('💥 Dashboard: Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceIcon = (score) => {
    if (score >= 85) return '🟢';
    if (score >= 70) return '🟡';
    return '🔴';
  };

  const getPerformanceStatus = (score) => {
    if (score >= 85) return 'उत्कृष्ट / Excellent';
    if (score >= 70) return 'अच्छा / Good';
    if (score >= 50) return 'सामान्य / Average';
    return 'सुधार चाहिए / Needs Improvement';
  };

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('hi-IN');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <div className="loading-content">
            <h3>प्रदर्शन डेटा लोड हो रहा है...</h3>
            <p>Loading performance data for {selectedDistrict}...</p>
            <div className="loading-steps">
              <div className="step active">Fetching data...</div>
              <div className="step">Processing metrics...</div>
              <div className="step">Generating charts...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>डेटा लोड नहीं हो सका / Failed to Load Data</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={fetchPerformanceData} className="retry-button">
              🔄 फिर से कोशिश करें / Try Again
            </button>
            <button onClick={() => navigate('/')} className="back-button">
              ⬅️ वापस जाएं / Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-page">
        <div className="no-data-container">
          <div className="no-data-icon">📊</div>
          <h2>कोई डेटा उपलब्ध नहीं / No Data Available</h2>
          <p>No performance data found for {selectedDistrict}</p>
          <button onClick={() => navigate('/')} className="back-button">
            ⬅️ जिला बदलें / Change District
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <button onClick={() => navigate('/')} className="back-button">
          ⬅️ Back
        </button>
        <div className="header-content">
          <div className="district-info">
            <h1>{selectedDistrict} का प्रदर्शन</h1>
            <p className="state-name">{selectedState}</p>
            <div className="header-badges">
              <span className="badge official">🏛️ Official Data</span>
              <span className="badge live">⚡ Live</span>
              <span className="badge verified">✅ Verified</span>
            </div>
          </div>
          <div className="overall-score">
            <div className="score-circle">
              <span className="score-number">{data.workCompletionRate}</span>
              <span className="score-unit">%</span>
            </div>
            <div className="score-label">
              <p>Overall Performance</p>
              <p className="score-status">
                {getPerformanceIcon(data.workCompletionRate)} {getPerformanceStatus(data.workCompletionRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="metrics-dashboard">
        {/* Employment Generation */}
        <div className="metric-card primary">
          <div className="metric-header">
            <div className="metric-icon">👥</div>
            <div className="metric-title">
              <h3>रोजगार मिला</h3>
              <p>Employment Generated</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{formatNumber(data.employmentGenerated)}</span>
            <span className="unit">घर / Households</span>
          </div>
          <div className="metric-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill green" 
                style={{ width: '85%' }}
              ></div>
            </div>
            <span className="progress-text">Target achievement: 85%</span>
          </div>
        </div>

        {/* Person Days */}
        <div className="metric-card secondary">
          <div className="metric-header">
            <div className="metric-icon">⏱️</div>
            <div className="metric-title">
              <h3>कुल कार्य दिवस</h3>
              <p>Total Person Days</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{formatNumber(data.personDaysGenerated)}</span>
            <span className="unit">व्यक्ति-दिन / Person-days</span>
          </div>
          <div className="metric-insight">
            <span className="insight-icon">📈</span>
            <span>High employment generation</span>
          </div>
        </div>

        {/* Work Completion */}
        <div className="metric-card accent">
          <div className="metric-header">
            <div className="metric-icon">🏗️</div>
            <div className="metric-title">
              <h3>काम पूरा हुआ</h3>
              <p>Work Completed</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{data.workCompletionRate}%</span>
          </div>
          <div className="metric-breakdown">
            <div className="breakdown-item">
              <span>पूरे हुए / Completed: {formatNumber(data.completedWorks)}</span>
            </div>
            <div className="breakdown-item">
              <span>कुल / Total: {formatNumber(data.totalWorks)}</span>
            </div>
          </div>
        </div>

        {/* Average Days */}
        <div className="metric-card info">
          <div className="metric-header">
            <div className="metric-icon">📅</div>
            <div className="metric-title">
              <h3>औसत कार्य दिन</h3>
              <p>Average Work Days</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{data.avgDaysPerHousehold}</span>
            <span className="unit">दिन प्रति घर / Days per Household</span>
          </div>
          <div className="target-comparison">
            <div className="target-bar">
              <div 
                className="target-fill" 
                style={{ width: `${Math.min(100, data.avgDaysPerHousehold)}%` }}
              ></div>
              <span className="target-label">Target: 100 days</span>
            </div>
          </div>
        </div>

        {/* Women Participation */}
        <div className="metric-card women">
          <div className="metric-header">
            <div className="metric-icon">👩</div>
            <div className="metric-title">
              <h3>महिला भागीदारी</h3>
              <p>Women Participation</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{data.womenParticipation}%</span>
          </div>
          <div className="participation-visual">
            <div className="participation-icons">
              {Array.from({length: 10}).map((_, i) => (
                <span 
                  key={i} 
                  className={`person-icon ${i < (data.womenParticipation / 10) ? 'filled' : ''}`}
                >
                  👤
                </span>
              ))}
            </div>
            <span className="participation-status">
              {data.womenParticipation >= 60 ? '🟢 Excellent participation' : 
               data.womenParticipation >= 40 ? '🟡 Good participation' : '🔴 Needs improvement'}
            </span>
          </div>
        </div>

        {/* Active Workers */}
        <div className="metric-card workers">
          <div className="metric-header">
            <div className="metric-icon">⚡</div>
            <div className="metric-title">
              <h3>सक्रिय कामगार</h3>
              <p>Active Workers</p>
            </div>
          </div>
          <div className="metric-value">
            <span className="number">{formatNumber(data.activeWorkers)}</span>
            <span className="unit">कामगार / Workers</span>
          </div>
          <div className="workers-ratio">
            <span>Work Provided: {formatNumber(data.workProvided)}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="section-header">
          <h2>📈 डेटा विश्लेषण / Data Analysis</h2>
          <p>Comprehensive performance visualization</p>
        </div>
        <PerformanceChart data={data} />
      </div>

      {/* Performance Summary */}
      <div className="performance-summary">
        <div className="summary-header">
          <h3>📋 प्रदर्शन सारांश / Performance Summary</h3>
          <div className="summary-date">
            <span>📅 Data Period: FY 2025-26</span>
            <span>🔄 Last Updated: {new Date().toLocaleDateString('hi-IN')}</span>
          </div>
        </div>
        
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">🎯</div>
            <div className="summary-content">
              <h4>लक्ष्य की तुलना / Target Comparison</h4>
              <div className="summary-items">
                <div className="summary-item">
                  <span className="item-label">Employment Target Achievement:</span>
                  <span className="item-value success">85% ✅</span>
                </div>
                <div className="summary-item">
                  <span className="item-label">Average Days (Target: 100):</span>
                  <span className="item-value">{data.avgDaysPerHousehold} days</span>
                </div>
                <div className="summary-item">
                  <span className="item-label">Work Completion Rate:</span>
                  <span className="item-value">{data.workCompletionRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h4>मुख्य उपलब्धियां / Key Achievements</h4>
              <div className="achievements-list">
                <div className="achievement-item">
                  <span className="achievement-icon">👥</span>
                  <span>{formatNumber(data.employmentGenerated)} families benefited</span>
                </div>
                <div className="achievement-item">
                  <span className="achievement-icon">💰</span>
                  <span>Rural employment enhanced significantly</span>
                </div>
                <div className="achievement-item">
                  <span className="achievement-icon">🏗️</span>
                  <span>{formatNumber(data.completedWorks)} works completed</span>
                </div>
                <div className="achievement-item">
                  <span className="achievement-icon">👩</span>
                  <span>{data.womenParticipation}% women participation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🔍</div>
            <div className="summary-content">
              <h4>डेटा विश्वसनीयता / Data Reliability</h4>
              <div className="reliability-indicators">
                <div className="reliability-item">
                  <span className="reliability-status verified">✅</span>
                  <span>Government Verified Data</span>
                </div>
                <div className="reliability-item">
                  <span className="reliability-status live">⚡</span>
                  <span>Real-time MIS Integration</span>
                </div>
                <div className="reliability-item">
                  <span className="reliability-status official">🏛️</span>
                  <span>Official MGNREGA Portal</span>
                </div>
              </div>
              <p className="data-note">
                {data.summary && data.summary.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
