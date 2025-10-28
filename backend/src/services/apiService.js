const axios = require('axios');
const logger = require('../utils/logger');

class DataGovAPIService {
  constructor() {
    this.baseURL = process.env.DATA_GOV_BASE_URL;
    this.apiKey = process.env.API_KEY;
    this.maxRetries = 3;
    this.retryDelay = 2000;
    
    // Known MGNREGA Resource IDs from research
    this.mgnregaResources = [
      {
        id: "9ef84268-d588-465a-a308-a864a43d0070", // Current (market data - demo)
        title: "Current Daily Price of Various Commodities from Various Markets (Mandi)",
        type: "market_demo"
      },
      // Add real MGNREGA resource IDs when found
      // These would need to be discovered from data.gov.in
      {
        id: "bf1da9fc565045c3be3b0ba006377869", // Example from search results
        title: "Expenditure under MGNREGA on Schedule Caste (SC) Persondays",
        type: "mgnrega_expenditure"
      }
    ];
    
    this.currentResource = this.mgnregaResources[0]; // Default to first resource
  }

  // Set which resource to use
  setResource(resourceIndex = 0) {
    if (resourceIndex < this.mgnregaResources.length) {
      this.currentResource = this.mgnregaResources[resourceIndex];
      logger.info(`Switched to resource: ${this.currentResource.title}`);
    }
  }

  async makeRequest(params = {}, resourceId = null) {
    const useResourceId = resourceId || this.currentResource.id;
    const url = `${this.baseURL}${useResourceId}`;
    
    const config = {
      params: {
        'api-key': this.apiKey,
        format: 'json',
        ...params
      },
      timeout: 30000,
      headers: {
        'User-Agent': 'MGNREGA-District-Tracker/1.0.0',
        'Accept': 'application/json',
      }
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info(`API Request attempt ${attempt}: ${url}`);
        const response = await axios.get(url, config);
        
        if (response.data && response.data.records) {
          logger.info(`API Success: Retrieved ${response.data.records.length} records`);
          return {
            success: true,
            data: response.data.records,
            total: response.data.total || response.data.records.length,
            metadata: {
              timestamp: new Date().toISOString(),
              source: 'data.gov.in',
              title: response.data.title || this.currentResource.title,
              resourceId: useResourceId,
              resourceType: this.currentResource.type
            }
          };
        } else {
          throw new Error('No records field in API response');
        }
      } catch (error) {
        logger.error(`API Request failed (attempt ${attempt}):`, {
          error: error.message,
          status: error.response?.status,
          url: url
        });

        if (attempt === this.maxRetries) {
          return {
            success: false,
            error: error.message,
            statusCode: error.response?.status || 500,
            retries: this.maxRetries,
            resourceId: useResourceId
          };
        }

        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  async getDistrictData(stateName = 'Andhra Pradesh') {
    // For market data (current demo), use 'state' filter
    if (this.currentResource.type === 'market_demo') {
      const params = {
        'filters[state]': stateName,
        limit: 1000,
        offset: 0
      };
      return await this.makeRequest(params);
    }
    
    // For real MGNREGA data, use appropriate filters
    const params = {
      'filters[state_name]': stateName, // Try both field variations
      'filters[State]': stateName,
      limit: 1000,
      offset: 0
    };
    
    return await this.makeRequest(params);
  }

  async getSpecificDistrictData(stateName, districtName, year = null, month = null) {
    // For market data (current demo)
    if (this.currentResource.type === 'market_demo') {
      const params = {
        'filters[state]': stateName,
        'filters[district]': districtName,
        limit: 100
      };
      return await this.makeRequest(params);
    }
    
    // For real MGNREGA data
    const params = {
      'filters[state_name]': stateName,
      'filters[State]': stateName, 
      'filters[district_name]': districtName,
      'filters[District]': districtName,
      limit: 100
    };

    if (year) {
      params['filters[year]'] = year;
      params['filters[Year]'] = year;
    }
    if (month) {
      params['filters[month]'] = month;
      params['filters[Month]'] = month;
    }

    return await this.makeRequest(params);
  }

  // Get available resources
  getAvailableResources() {
    return this.mgnregaResources;
  }

  // Test all available resources
  async testAllResources() {
    const results = [];
    
    for (let i = 0; i < this.mgnregaResources.length; i++) {
      const resource = this.mgnregaResources[i];
      logger.info(`Testing resource: ${resource.title}`);
      
      try {
        const result = await this.makeRequest({ limit: 5 }, resource.id);
        results.push({
          resource: resource,
          success: result.success,
          recordCount: result.success ? result.data.length : 0,
          error: result.error || null
        });
      } catch (error) {
        results.push({
          resource: resource,
          success: false,
          recordCount: 0,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

module.exports = DataGovAPIService;
