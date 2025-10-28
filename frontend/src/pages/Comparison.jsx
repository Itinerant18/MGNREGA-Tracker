import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import './Comparison.css';

const Comparison = ({ selectedState }) => {
  const [comparativeData, setComparativeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('employmentGenerated');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComparativeData();
  }, [selectedState]);

  const fetchComparativeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/comparative/${encodeURIComponent(selectedState)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data)) {
        setComparativeData(result.data);
        console.log('Comparative data loaded:', result.data.length, 'districts');
      } else {
        console.error('Invalid response structure:', result);
        setError(result.error || 'Invalid data structure received');
      }
    } catch (err) {
      console.error('Error fetching comparative data:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMetricLabel = (metric) => {
    const labels = {
      employmentGenerated: 'रोजगार मिला / Employment',
      workCompletionRate: 'काम पूरा / Work Completion',
      womenParticipation: 'महिला भागीदारी / Women Participation',
      avgDaysPerHousehold: 'औसत दिन / Average Days'
    };
    return labels[metric] || metric;
  };

  const getChartData = () => {
    // Add safety checks
    if (!comparativeData || !Array.isArray(comparativeData) || comparativeData.length === 0) {
      console.log('No comparative data available for chart');
      return null;
    }

    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#FF5722'];
    
    // Ensure we have valid data for the selected metric
    const validData = comparativeData.filter(item => 
      item && 
      typeof item === 'object' && 
      item.district && 
      typeof item[selectedMetric] === 'number'
    );

    if (validData.length === 0) {
      console.log('No valid data for selected metric:', selectedMetric);
      return null;
    }

    return {
      labels: validData.map(item => item.district),
      datasets: [{
        label: getMetricLabel(selectedMetric),
        data: validData.map(item => item[selectedMetric]),
        backgroundColor: colors.slice(0, validData.length),
        borderColor: colors.slice(0, validData.length),
        borderWidth: 2,
        borderRadius: 8,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            const suffix = selectedMetric.includes('Rate') || selectedMetric.includes('Participation') ? '%' : '';
            return `${context.parsed.y.toLocaleString('hi-IN')}${suffix}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          },
          maxRotation: 45
        }
      }
    }
  };

  const getBestPerformer = (metric) => {
    if (!comparativeData || comparativeData.length === 0) return null;
    
    const validData = comparativeData.filter(item => 
      item && typeof item[metric] === 'number'
    );
    
    if (validData.length === 0) return null;
    
    return validData.reduce((best, current) => 
      current[metric] > best[metric] ? current : best
    );
  };

  const getWorstPerformer = (metric) => {
    if (!comparativeData || comparativeData.length === 0) return null;
    
    const validData = comparativeData.filter(item => 
      item && typeof item[metric] === 'number'
    );
    
    if (validData.length === 0) return null;
    
    return validData.reduce((worst, current) => 
      current[metric] < worst[metric] ? current : worst
    );
  };

  if (loading) {
    return (
      <div className="comparison-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>तुलनात्मक डेटा लोड हो रहा है... / Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comparison-page">
        <div className="error-container">
          <h2>⚠️ डेटा लोड नहीं हो सका / Failed to Load Data</h2>
          <p>Error: {error}</p>
          <div className="error-actions">
            <button onClick={fetchComparativeData} className="retry-button">
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

  // If no data available
  if (!comparativeData || comparativeData.length === 0) {
    return (
      <div className="comparison-page">
        <div className="no-data-container">
          <div className="no-data-content">
            <h2>📊 कोई तुलनात्मक डेटा उपलब्ध नहीं / No Comparative Data Available</h2>
            <p>Selected State: {selectedState}</p>
            <p>कृपया बाद में पुनः प्रयास करें। / Please try again later.</p>
            <button onClick={() => navigate('/')} className="back-button">
              ⬅️ होम पर वापस जाएं / Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <button onClick={() => navigate('/')} className="back-button">
          ⬅️ वापस / Back
        </button>
        <div className="header-info">
          <h1>📊 जिलों की तुलना / District Comparison</h1>
          <p className="state-info">{selectedState}</p>
          <div className="data-info">
            <span className="district-count">{comparativeData.length} Districts</span>
            <div className="real-data-badge">
              <span className="badge-icon">✅</span>
              <span>वास्तविक MGNREGA डेटा / Real MGNREGA Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="metric-selector">
        <h3>तुलना का आधार चुनें / Choose Comparison Metric:</h3>
        <div className="metric-buttons">
          {[
            { key: 'employmentGenerated', icon: '👥', label: 'रोजगार / Employment' },
            { key: 'workCompletionRate', icon: '🏗️', label: 'काम पूरा / Work Done' },
            { key: 'womenParticipation', icon: '👩', label: 'महिला भागीदारी / Women' },
            { key: 'avgDaysPerHousehold', icon: '📅', label: 'औसत दिन / Avg Days' }
          ].map(metric => (
            <button
              key={metric.key}
              className={`metric-btn ${selectedMetric === metric.key ? 'active' : ''}`}
              onClick={() => setSelectedMetric(metric.key)}
            >
              <span className="metric-icon">{metric.icon}</span>
              <span className="metric-label">{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Chart */}
      {chartData && (
        <div className="comparison-chart-container">
          <h3>📈 जिलेवार तुलना / District-wise Comparison</h3>
          <div className="chart-wrapper">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Performance Rankings */}
      <div className="rankings-section">
        <div className="ranking-card best">
          <div className="ranking-header">
            <span className="ranking-icon">🥇</span>
            <h4>सर्वश्रेष्ठ प्रदर्शन / Best Performer</h4>
          </div>
          {getBestPerformer(selectedMetric) ? (
            <div className="ranking-content">
              <h3>{getBestPerformer(selectedMetric).district}</h3>
              <p className="ranking-value">
                {getBestPerformer(selectedMetric)[selectedMetric].toLocaleString('hi-IN')}
                {selectedMetric.includes('Rate') || selectedMetric.includes('Participation') ? '%' : ''}
              </p>
            </div>
          ) : (
            <p>डेटा उपलब्ध नहीं / No data available</p>
          )}
        </div>

        <div className="ranking-card worst">
          <div className="ranking-header">
            <span className="ranking-icon">📈</span>
            <h4>सुधार की गुंजाइश / Needs Improvement</h4>
          </div>
          {getWorstPerformer(selectedMetric) ? (
            <div className="ranking-content">
              <h3>{getWorstPerformer(selectedMetric).district}</h3>
              <p className="ranking-value">
                {getWorstPerformer(selectedMetric)[selectedMetric].toLocaleString('hi-IN')}
                {selectedMetric.includes('Rate') || selectedMetric.includes('Participation') ? '%' : ''}
              </p>
            </div>
          ) : (
            <p>डेटा उपलब्ध नहीं / No data available</p>
          )}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="comparison-table-container">
        <h3>📋 विस्तृत तुलना / Detailed Comparison</h3>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>जिला / District</th>
                <th>👥 रोजगार / Employment</th>
                <th>🏗️ काम पूरा / Work Done</th>
                <th>👩 महिला % / Women %</th>
                <th>📅 औसत दिन / Avg Days</th>
              </tr>
            </thead>
            <tbody>
              {comparativeData.map((district, index) => (
                <tr key={district.district} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td className="district-name">{district.district}</td>
                  <td>{(district.employmentGenerated || 0).toLocaleString('hi-IN')}</td>
                  <td>{district.workCompletionRate || 0}%</td>
                  <td>{district.womenParticipation || 0}%</td>
                  <td>{district.avgDaysPerHousehold || 0} दिन / days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
