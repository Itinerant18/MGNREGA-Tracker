const express = require('express');
const router = express.Router();
const CSVDataService = require('../services/csvDataService');
const logger = require('../utils/logger');

const csvDataService = new CSVDataService();

// CSV File status endpoint
router.get('/data-source/status', async (req, res) => {
  try {
    const status = csvDataService.getFileStatus();
    res.json({
      success: true,
      fileStatus: status,
      timestamp: new Date().toISOString(),
      message: 'CSV data source is active'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Manual data refresh endpoint
router.post('/data-source/refresh', async (req, res) => {
  try {
    const result = await csvDataService.refreshData();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get districts - now from CSV file
router.get('/districts/:stateName', async (req, res) => {
  try {
    const { stateName } = req.params;
    const cacheKey = `csv_districts_${stateName.replace(/\s+/g, '_')}`;
    
    logger.info(`Fetching districts from CSV for: ${stateName}`);
    
    // Try cache first
    let cachedData = await req.cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true
      });
    }

    // Get from CSV file
    const result = await csvDataService.getDistrictsForState(stateName);
    
    if (result.success) {
      // Cache for 30 minutes (CSV file doesn't change often)
      await req.cacheService.set(cacheKey, result, 1800);
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    logger.error('Error in CSV districts endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

// Get performance - now from CSV file
router.get('/performance/:stateName/:districtName', async (req, res) => {
  try {
    const { stateName, districtName } = req.params;
    const cacheKey = `csv_performance_${stateName.replace(/\s+/g, '_')}_${districtName.replace(/\s+/g, '_')}`;
    
    logger.info(`Fetching performance from CSV for: ${districtName}, ${stateName}`);
    
    // Try cache first
    let cachedData = await req.cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true
      });
    }

    // Get from CSV file
    const result = await csvDataService.getDistrictPerformance(stateName, districtName);
    
    if (result.success) {
      // Cache for 30 minutes
      await req.cacheService.set(cacheKey, result, 1800);
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    logger.error('Error in CSV performance endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

// Get comparative data - now from CSV file
router.get('/comparative/:stateName', async (req, res) => {
  try {
    const { stateName } = req.params;
    const result = await csvDataService.getComparativeData(stateName);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    logger.error('Error in CSV comparative endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

module.exports = router;
