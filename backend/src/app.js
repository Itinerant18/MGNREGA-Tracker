const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const SimpleCacheService = require('./services/simpleCacheService');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy setting (fixes the rate limiting warning)
app.set('trust proxy', 1);

// Initialize cache service
const cacheService = new SimpleCacheService();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting (now with proper proxy support)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make cache service available to routes
app.use((req, res, next) => {
  req.cacheService = cacheService;
  next();
});

// Import and use routes (after middleware setup)
const apiRoutes = require('./routes/api');
const healthRoutes = require('./routes/health');

app.use('/api', apiRoutes);
app.use('/health', healthRoutes);

// Add cache stats endpoint
app.get('/cache-stats', (req, res) => {
  res.json({
    success: true,
    stats: cacheService.getStats(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableEndpoints: [
      'GET /health - Check API health',
      'GET /cache-stats - View cache statistics',
      'GET /api/data-source/status - CSV file status',
      'GET /api/districts/:stateName - Get districts for a state',
      'GET /api/performance/:stateName/:districtName - Get district performance'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log('\n🚀 MGNREGA Tracker API Server Started Successfully!');
  console.log('='.repeat(50));
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Cache stats: http://localhost:${PORT}/cache-stats`);
  console.log(`📁 Data source status: http://localhost:${PORT}/api/data-source/status`);
  console.log(`🏘️  Districts: http://localhost:${PORT}/api/districts/Andhra%20Pradesh`);
  console.log(`📱 Performance: http://localhost:${PORT}/api/performance/Andhra%20Pradesh/Srikakulam`);
  console.log('='.repeat(50));
  console.log('✅ Backend ready for frontend connection\n');
});

module.exports = app;
