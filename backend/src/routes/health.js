const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    api: {
      dataGovUrl: process.env.DATA_GOV_BASE_URL,
      resourceId: process.env.MGNREGA_RESOURCE_ID,
      hasApiKey: !!process.env.API_KEY
    }
  };

  logger.info('Health check requested');
  res.json(healthData);
});

module.exports = router;
