const admin = require('firebase-admin');
const logger = require('../utils/logger');

// Initialize Firebase Admin SDK
let db;

const initializeFirebase = () => {
  try {
    // For development, we'll use Application Default Credentials or service account
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        // For now, we'll use default credentials
        // Later you can add service account key
      });
    }

    db = admin.firestore();
    logger.info('Firebase initialized successfully');
    
    return db;
  } catch (error) {
    logger.error('Firebase initialization failed:', error.message);
    // For development, continue without Firebase
    logger.warn('Continuing without Firebase - using in-memory caching');
    return null;
  }
};

const getFirestore = () => {
  if (!db) {
    return initializeFirebase();
  }
  return db;
};

module.exports = {
  initializeFirebase,
  getFirestore,
  admin
};
