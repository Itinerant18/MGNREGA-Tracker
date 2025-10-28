const { getFirestore } = require('../config/firebase');
const logger = require('../utils/logger');

class DataService {
  constructor() {
    this.db = getFirestore();
    this.districtsCollection = 'districts';
    this.performanceCollection = 'performance';
    this.statesCollection = 'states';
  }

  // Store district list for a state
  async storeDistrictsForState(stateName, districts) {
    try {
      const stateDoc = {
        name: stateName,
        districts: districts,
        totalDistricts: districts.length,
        lastUpdated: new Date(),
        dataSource: 'data.gov.in'
      };

      await this.db.collection(this.statesCollection).doc(stateName).set(stateDoc);
      logger.info(`Stored ${districts.length} districts for state: ${stateName}`);
    } catch (error) {
      logger.error(`Error storing districts for ${stateName}:`, error);
      throw error;
    }
  }

  // Get stored district list for a state
  async getDistrictsForState(stateName) {
    try {
      const doc = await this.db.collection(this.statesCollection).doc(stateName).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        districts: data.districts,
        totalDistricts: data.totalDistricts,
        lastUpdated: data.lastUpdated
      };
    } catch (error) {
      logger.error(`Error getting districts for ${stateName}:`, error);
      return null;
    }
  }

  // Store performance data for a district
  async storePerformanceData(stateName, districtName, performanceData, filters = {}) {
    try {
      const docId = `${stateName}_${districtName}_${filters.year || 'all'}_${filters.month || 'all'}`;
      
      const performanceDoc = {
        stateName,
        districtName,
        performance: performanceData,
        filters,
        lastUpdated: new Date(),
        dataSource: 'data.gov.in'
      };

      await this.db.collection(this.performanceCollection).doc(docId).set(performanceDoc);
      logger.info(`Stored performance data for: ${districtName}, ${stateName}`);
    } catch (error) {
      logger.error(`Error storing performance data for ${districtName}:`, error);
      throw error;
    }
  }

  // Get stored performance data for a district
  async getPerformanceData(stateName, districtName, filters = {}) {
    try {
      const docId = `${stateName}_${districtName}_${filters.year || 'all'}_${filters.month || 'all'}`;
      const doc = await this.db.collection(this.performanceCollection).doc(docId).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        performance: data.performance,
        lastUpdated: data.lastUpdated,
        filters: data.filters
      };
    } catch (error) {
      logger.error(`Error getting performance data for ${districtName}:`, error);
      return null;
    }
  }

  // Store API failure logs for monitoring
  async logAPIFailure(endpoint, error, retryCount) {
    try {
      await this.db.collection('api_logs').add({
        endpoint,
        error: error.message,
        statusCode: error.response?.status,
        retryCount,
        timestamp: new Date(),
        resolved: false
      });
    } catch (logError) {
      logger.error('Error logging API failure:', logError);
    }
  }

  // Get API health statistics
  async getAPIHealthStats() {
    try {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const failuresQuery = this.db.collection('api_logs')
        .where('timestamp', '>=', last24Hours);
      
      const snapshot = await failuresQuery.get();
      
      return {
        totalFailures: snapshot.size,
        last24Hours: snapshot.size,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Error getting API health stats:', error);
      return { totalFailures: 0, last24Hours: 0, lastUpdated: new Date() };
    }
  }
}

module.exports = DataService;
