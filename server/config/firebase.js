import admin from 'firebase-admin';
import { env } from './env.js';
import { logger } from './logger.js';

try {
  if (env.FIREBASE_CREDENTIALS_JSON) {
    const serviceAccount = JSON.parse(env.FIREBASE_CREDENTIALS_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    logger.info('Firebase Admin SDK successfully initialized via FIREBASE_CREDENTIALS_JSON.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    logger.info('Firebase Admin SDK initialized via Application Default Credentials.');
  } else {
    // We attempt default init, but catch to prevent crashing if no keys exist
    admin.initializeApp();
    logger.info('Firebase Admin SDK initialized via default application configuration.');
  }
} catch (error) {
  logger.warn(`⚠️ Firebase Admin SDK failed to initialize: ${error.message}. Running in Mock Auth fallback mode.`);
}

export default admin;
