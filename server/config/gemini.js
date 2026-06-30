import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';
import { logger } from './logger.js';

const apiKey = env.GEMINI_API_KEY;

if (!apiKey) {
  logger.warn('⚠️ GEMINI_API_KEY is not defined in environment variables. AI features will run in mock fallback mode.');
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getGeminiModel = (modelName = 'gemini-2.5-flash') => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
};
