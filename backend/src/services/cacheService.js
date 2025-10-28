const { getFirestore } = require('../config/firebase');
const InMemoryCacheService = require('./fallbackCache');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.db = getFirestore();
    
    if (!this.db) {
      logger.warn('Firebase not available, using in-memory cache');
      this.fallbackCache = new InMemoryCacheService();
      this.useFirebase = false;
    } else {
      this.cacheCollection = 'cache';
      this.useFirebase = true;
      logger.info('Using Firebase for caching');
    }
  }

  async get(key) {
    if (!this.useFirebase) {
      return this.fallbackCache.get(key);
    }

    try {
      const docRef = this.db.collection(this.cacheCollection).doc(key);
      const doc = await docRef.get();

      if (!doc.exists) {
        logger.debug(`Cache miss for key: ${key}`);
        return null;
      }

      const data = doc.data();
      const now = new Date();
      
      // Check if cached data has expired
      if (data.expiresAt && new Date(data.expiresAt.toDate()) < now) {
        logger.debug(`Cache expired for key: ${key}`);
        await docRef.delete();
        return null;
      }

      logger.debug(`Cache hit for key: ${key}`);
      return data.value;
    } catch (error) {
      logger.error(`Firebase cache error for key ${key}:`, error);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    if (!this.useFirebase) {
      return this.fallbackCache.set(key, value, ttlSeconds);
    }

    try {
      const expiresAt = new Date(Date.now() + (ttlSeconds * 1000));
      
      await this.db.collection(this.cacheCollection).doc(key).set({
        value: value,
        createdAt: new Date(),
        expiresAt: expiresAt,
        ttl: ttlSeconds
      });

      logger.debug(`Firebase cache set for key: ${key}, TTL: ${ttlSeconds}s`);
    } catch (error) {
      logger.error(`Firebase cache set error for key ${key}:`, error);
    }
  }

  async delete(key) {
    if (!this.useFirebase) {
      return this.fallbackCache.delete(key);
    }

    try {
      await this.db.collection(this.cacheCollection).doc(key).delete();
      logger.debug(`Firebase cache deleted for key: ${key}`);
    } catch (error) {
      logger.error(`Firebase cache delete error for key ${key}:`, error);
    }
  }

  async clear() {
    if (!this.useFirebase) {
      return this.fallbackCache.clear();
    }

    try {
      const batch = this.db.batch();
      const snapshot = await this.db.collection(this.cacheCollection).get();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      logger.info('Firebase cache cleared successfully');
    } catch (error) {
      logger.error('Firebase cache clear error:', error);
    }
  }

  async cleanupExpired() {
    if (!this.useFirebase) {
      return this.fallbackCache.cleanupExpired();
    }

    try {
      const now = new Date();
      const expiredQuery = this.db.collection(this.cacheCollection)
        .where('expiresAt', '<', now);
      
      const snapshot = await expiredQuery.get();
      
      if (snapshot.empty) {
        logger.debug('No expired cache entries to clean up');
        return;
      }

      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      logger.info(`Cleaned up ${snapshot.size} expired cache entries`);
    } catch (error) {
      logger.error('Firebase cache cleanup error:', error);
    }
  }
}

module.exports = CacheService;
