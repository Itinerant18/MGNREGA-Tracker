import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import './PerformanceChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PerformanceChart = ({ data, type = 'overview' }) => {
  if (!data) return null;

  // Overview Chart - Bar Chart
  const overviewData = {
    labels: [
      'रोजगार मिला\nEmployment',
      'औसत दिन\nAvg Days',
      'काम पूरा\nWork Done',
      'महिला भागीदारी\nWomen %'
    ],
    datasets: [
      {
        label: 'Performance',
        data: [
          data.employmentGenerated / 100, // Scale down for better visualization
          data.avgDaysPerHousehold,
          data.workCompletionRate,
          data.womenParticipation
        ],
        backgroundColor: [
          '#4CAF50',
          '#2196F3', 
          '#FF9800',
          '#E91E63'
        ],
        borderColor: [
          '#388E3C',
          '#1976D2',
          '#F57C00', 
          '#C2185B'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  // Women Participation Doughnut Chart
  const womenParticipationData = {
    labels: [
      'महिला भागीदारी\nWomen Participation', 
      'अन्य\nOthers'
    ],
    datasets: [
      {
        data: [data.womenParticipation, 100 - data.womenParticipation],
        backgroundColor: ['#E91E63', '#F8BBD9'],
        borderColor: ['#C2185B', '#F48FB1'],
        borderWidth: 2,
      }
    ]
  };

  // Work Completion Progress
  const workCompletionData = {
    labels: [
      'पूरा हुआ\nCompleted',
      'बाकी\nRemaining'
    ],
    datasets: [
      {
        data: [data.workCompletionRate, 100 - data.workCompletionRate],
        backgroundColor: ['#FF9800', '#FFE0B2'],
        borderColor: ['#F57C00', '#FFCC02'],
        borderWidth: 2,
      }
    ]
  };

  // Employment Progress vs Target
  const employmentProgressData = {
    labels: ['Employment Progress'],
    datasets: [
      {
        label: 'Achieved / प्राप्त',
        data: [data.employmentGenerated],
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 2
      },
      {
        label: 'Target / लक्ष्य', 
        data: [data.employmentGenerated * 1.2], // Mock target
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2E7D32',
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 16,
          family: "'Noto Sans Devanagari', Arial, sans-serif"
        },
        bodyFont: {
          size: 14,
          family: "'Noto Sans Devanagari', Arial, sans-serif"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E0E0E0',
        },
        ticks: {
          font: {
            size: 12,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: "'Noto Sans Devanagari', Arial, sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    },
    cutout: '60%',
  };

  return (
    <div className="performance-charts">
      {/* Overview Bar Chart */}
      <div className="chart-container">
        <h3 className="chart-title">📊 समग्र प्रदर्शन / Overall Performance</h3>
        <div className="chart-wrapper">
          <Bar data={overviewData} options={chartOptions} />
        </div>
      </div>

      {/* Women Participation Doughnut */}
      <div className="chart-container">
        <h3 className="chart-title">👩 महिला भागीदारी / Women Participation</h3>
        <div className="chart-wrapper doughnut">
          <Doughnut data={womenParticipationData} options={doughnutOptions} />
          <div className="chart-center-text">
            <span className="percentage">{data.womenParticipation}%</span>
            <span className="label">महिलाएं</span>
          </div>
        </div>
      </div>

      {/* Work Completion Progress */}
      <div className="chart-container">
        <h3 className="chart-title">🏗️ काम की प्रगति / Work Progress</h3>
        <div className="chart-wrapper doughnut">
          <Doughnut data={workCompletionData} options={doughnutOptions} />
          <div className="chart-center-text">
            <span className="percentage">{data.workCompletionRate}%</span>
            <span className="label">पूरा</span>
          </div>
        </div>
      </div>

      {/* Employment vs Target */}
      <div className="chart-container full-width">
        <h3 className="chart-title">🎯 रोजगार लक्ष्य बनाम प्राप्ति / Employment Target vs Achievement</h3>
        <div className="chart-wrapper">
          <Bar data={employmentProgressData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
