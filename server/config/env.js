import dotenv from 'dotenv';
dotenv.config();
const getEnv = (key, defaultValue = undefined, required = false) => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (required) {
      throw new Error(`Environment variable ${key} is required but missing.`);
    }
    return defaultValue;
  }
  return value;
};
export const env = {
  PORT: parseInt(getEnv('PORT', '8000'), 10),
  MONGODB_URI: getEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/deadlinepilot'),
  GEMINI_API_KEY: getEnv('GEMINI_API_KEY', ''),
  FIREBASE_CREDENTIALS_JSON: getEnv('FIREBASE_CREDENTIALS_JSON', ''),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  CLIENT_URL: getEnv('CLIENT_URL', ''),
};
