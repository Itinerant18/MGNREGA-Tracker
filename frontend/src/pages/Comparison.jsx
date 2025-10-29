import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import mgnregaService from '../services/mgnregaDataService';
import './Comparison.css';

const Comparison = ({ selectedState }) => {
  const [comparativeData, setComparativeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('employmentGenerated');
  const [sortBy, setSortBy] = useState('alphabetical');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComparativeData();
  }, [selectedState]);

  const fetchComparativeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Comparison: Fetching comparative data for', selectedState);
      const result = await mgnregaService.getComparativeData(selectedState);
      
      if (result.success && result.data && Array.isArray(result.data)) {
        setComparativeData(result.data);
        console.log('✅ Comparison: Data loaded for', result.data.length, 'districts');
      } else {
        console.error('❌ Comparison: Invalid response structure:', result);
        setError(result.error || 'Invalid data structure received');
      }
    } catch (err) {
      console.error('💥 Comparison: Network error:', err);
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

  const getSortedData = () => {
    if (!comparativeData || !Array.isArray(comparativeData)) return [];

    const sortedData = [...comparativeData];
    
    switch (sortBy) {
      case 'highest':
        return sortedData.sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0));
      case 'lowest':
        return sortedData.sort((a, b) => (a[selectedMetric] || 0) - (b[selectedMetric] || 0));
      default:
        return sortedData.sort((a, b) => a.district.localeCompare(b.district));
    }
  };

  const getChartData = () => {
    const sortedData = getSortedData();
    if (!sortedData || sortedData.length === 0) return null;

    const validData = sortedData.filter(item => 
      item && typeof item === 'object' && item.district && typeof item[selectedMetric] === 'number'
    );

    if (validData.length === 0) return null;

    // Color coding based on performance
    const colors = validData.map(item => {
      const value = item[selectedMetric];
      if (selectedMetric.includes('Rate') || selectedMetric.includes('Participation')) {
        if (value >= 80) return '#4CAF50'; // Green for high performance
        if (value >= 60) return '#FF9800'; // Orange for medium
        return '#f44336'; // Red for low
      } else {
        // For employment and days, use gradient
        return `hsl(${120 + (value / Math.max(...validData.map(d => d[selectedMetric]))) * 60}, 70%, 50%)`;
      }
    });

    return {
      labels: validData.map(item => item.district),
      datasets: [{
        label: getMetricLabel(selectedMetric),
        data: validData.map(item => item[selectedMetric]),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('50%', '40%')),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4CAF50',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const suffix = selectedMetric.includes('Rate') || selectedMetric.includes('Participation') ? '%' : '';
            const value = context.parsed.y.toLocaleString('hi-IN');
            return `${getMetricLabel(selectedMetric)}: ${value}${suffix}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          },
          color: '#666',
          callback: function(value) {
            if (selectedMetric.includes('Rate') || selectedMetric.includes('Participation')) {
              return value + '%';
            }
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
            return value;
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          },
          color: '#666',
          maxRotation: 45,
          minRotation: 0
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  const getTopPerformers = (metric, count = 3) => {
    if (!comparativeData || comparativeData.length === 0) return [];
    
    const validData = comparativeData.filter(item => 
      item && typeof item[metric] === 'number'
    );
    
    return validData
      .sort((a, b) => b[metric] - a[metric])
      .slice(0, count);
  };

  const getBottomPerformers = (metric, count = 3) => {
    if (!comparativeData || comparativeData.length === 0) return [];
    
    const validData = comparativeData.filter(item => 
      item && typeof item[metric] === 'number'
    );
    
    return validData
      .sort((a, b) => a[metric] - b[metric])
      .slice(0, count);
  };

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('hi-IN');
  };

  if (loading) {
    return (
      <div className="comparison-page">
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <div className="loading-content">
            <h3>तुलनात्मक डेटा लोड हो रहा है...</h3>
            <p>Loading comparison data for all 26 districts...</p>
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <span>Processing government data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comparison-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>डेटा लोड नहीं हो सका / Failed to Load Data</h2>
          <p className="error-message">{error}</p>
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

  if (!comparativeData || comparativeData.length === 0) {
    return (
      <div className="comparison-page">
        <div className="no-data-container">
          <div className="no-data-icon">📊</div>
          <h2>कोई तुलनात्मक डेटा उपलब्ध नहीं</h2>
          <p>No comparative data available for {selectedState}</p>
          <button onClick={() => navigate('/')} className="back-button">
            ⬅️ होम पर वापस जाएं / Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const topPerformers = getTopPerformers(selectedMetric);
  const bottomPerformers = getBottomPerformers(selectedMetric);

  return (
    <div className="comparison-page">
      {/* Header Section */}
      <div className="comparison-header">
        <button onClick={() => navigate('/')} className="back-button">
          ⬅️ Back
        </button>
        <div className="header-content">
          <div className="header-main">
            <h1>📊 जिलों की तुलना / District Comparison</h1>
            <p className="state-name">{selectedState}</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{comparativeData.length}</span>
              <span className="stat-label">Districts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Real Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="metric-selector">
          <h3>तुलना का आधार चुनें / Choose Comparison Metric:</h3>
          <div className="metric-buttons">
            {[
              { key: 'employmentGenerated', icon: '👥', label: 'रोजगार / Employment', color: '#4CAF50' },
              { key: 'workCompletionRate', icon: '🏗️', label: 'काम पूरा / Work Done', color: '#FF9800' },
              { key: 'womenParticipation', icon: '👩', label: 'महिला भागीदारी / Women', color: '#E91E63' },
              { key: 'avgDaysPerHousehold', icon: '📅', label: 'औसत दिन / Avg Days', color: '#2196F3' }
            ].map(metric => (
              <button
                key={metric.key}
                className={`metric-btn ${selectedMetric === metric.key ? 'active' : ''}`}
                onClick={() => setSelectedMetric(metric.key)}
                style={{ '--accent-color': metric.color }}
              >
                <span className="metric-icon">{metric.icon}</span>
                <span className="metric-label">{metric.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sort-controls">
          <h4>क्रम / Sort Order:</h4>
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortBy === 'alphabetical' ? 'active' : ''}`}
              onClick={() => setSortBy('alphabetical')}
            >
              🔤 A-Z
            </button>
            <button 
              className={`sort-btn ${sortBy === 'highest' ? 'active' : ''}`}
              onClick={() => setSortBy('highest')}
            >
              📈 Highest First
            </button>
            <button 
              className={`sort-btn ${sortBy === 'lowest' ? 'active' : ''}`}
              onClick={() => setSortBy('lowest')}
            >
              📉 Lowest First
            </button>
          </div>
        </div>
      </div>

      {/* Performance Leaders */}
      <div className="leaders-section">
        <div className="leaders-grid">
          <div className="leaders-card top">
            <div className="card-header">
              <span className="card-icon">🏆</span>
              <h3>शीर्ष प्रदर्शनकर्ता / Top Performers</h3>
            </div>
            <div className="leaders-list">
              {topPerformers.map((district, index) => (
                <div key={district.district} className="leader-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="district-name">{district.district}</span>
                  <span className="performance-value">
                    {selectedMetric.includes('Generated') ? 
                      formatNumber(district[selectedMetric]) : 
                      `${district[selectedMetric]}${selectedMetric.includes('Rate') || selectedMetric.includes('Participation') ? '%' : ''}`
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="leaders-card improvement">
            <div className="card-header">
              <span className="card-icon">📈</span>
              <h3>सुधार की आवश्यकता / Needs Improvement</h3>
            </div>
            <div className="leaders-list">
              {bottomPerformers.map((district, index) => (
                <div key={district.district} className="leader-item">
                  <span className="rank improvement">#{comparativeData.length - bottomPerformers.length + index + 1}</span>
                  <span className="district-name">{district.district}</span>
                  <span className="performance-value">
                    {selectedMetric.includes('Generated') ? 
                      formatNumber(district[selectedMetric]) : 
                      `${district[selectedMetric]}${selectedMetric.includes('Rate') || selectedMetric.includes('Participation') ? '%' : ''}`
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      {chartData && (
        <div className="chart-section">
          <div className="chart-header">
            <h3>📈 जिलेवार प्रदर्शन चार्ट / District Performance Chart</h3>
            <div className="chart-info">
              <span>Metric: {getMetricLabel(selectedMetric)}</span>
              <span>•</span>
              <span>Sort: {sortBy === 'alphabetical' ? 'A-Z' : sortBy === 'highest' ? 'High to Low' : 'Low to High'}</span>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-wrapper">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Detailed Comparison Table */}
      <div className="table-section">
        <div className="table-header">
          <h3>📋 विस्तृत तुलना तालिका / Detailed Comparison Table</h3>
          <div className="table-stats">
            <span>📊 {comparativeData.length} Districts</span>
            <span>📅 FY 2025-26</span>
            <span>🏛️ Official Data</span>
          </div>
        </div>
        <div className="table-container">
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="rank-col">#</th>
                  <th className="district-col">जिला / District</th>
                  <th className="metric-col">👥 Employment</th>
                  <th className="metric-col">🏗️ Work Done %</th>
                  <th className="metric-col">👩 Women %</th>
                  <th className="metric-col">📅 Avg Days</th>
                </tr>
              </thead>
              <tbody>
                {getSortedData().map((district, index) => (
                  <tr key={district.district} className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td className="rank-cell">{index + 1}</td>
                    <td className="district-cell">
                      <span className="district-name">{district.district}</span>
                    </td>
                    <td className="metric-cell">
                      <span className="metric-value">
                        {formatNumber(district.employmentGenerated || 0)}
                      </span>
                    </td>
                    <td className="metric-cell">
                      <div className="percentage-cell">
                        <span className="percentage-value">{district.workCompletionRate || 0}%</span>
                        <div className="mini-progress">
                          <div 
                            className="mini-progress-fill" 
                            style={{ width: `${district.workCompletionRate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="metric-cell">
                      <div className="percentage-cell">
                        <span className="percentage-value">{district.womenParticipation || 0}%</span>
                        <div className="mini-progress women">
                          <div 
                            className="mini-progress-fill women" 
                            style={{ width: `${district.womenParticipation || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="metric-cell">
                      <span className="days-value">
                        {district.avgDaysPerHousehold || 0} <small>days</small>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
