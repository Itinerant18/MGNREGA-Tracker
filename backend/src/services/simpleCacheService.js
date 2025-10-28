const logger = require('../utils/logger');

class SimpleCacheService {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
    logger.info('Using in-memory cache service');
  }

  async get(key) {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        logger.debug(`Cache miss for key: ${key}`);
        return null;
      }

      logger.debug(`Cache hit for key: ${key}`);
      return item.value;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    try {
      // Clear existing timer if exists
      const existingTimer = this.timers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set the value
      this.cache.set(key, {
        value: value,
        createdAt: new Date(),
        ttl: ttlSeconds
      });

      // Set expiration timer
      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
        logger.debug(`Cache expired for key: ${key}`);
      }, ttlSeconds * 1000);

      this.timers.set(key, timer);
      logger.debug(`Cache set for key: ${key}, TTL: ${ttlSeconds}s`);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async delete(key) {
    try {
      const timer = this.timers.get(key);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(key);
      }
      this.cache.delete(key);
      logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async clear() {
    try {
      // Clear all timers
      for (const timer of this.timers.values()) {
        clearTimeout(timer);
      }
      this.timers.clear();
      this.cache.clear();
      logger.info('Cache cleared successfully');
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  }

  async cleanupExpired() {
    // With setTimeout, expired items are already removed
    logger.debug('In-memory cache auto-cleanup active');
  }

  // Get cache statistics
  getStats() {
    return {
      totalItems: this.cache.size,
      activeTimers: this.timers.size,
      memoryUsage: process.memoryUsage()
    };
  }
}

module.exports = SimpleCacheService;
