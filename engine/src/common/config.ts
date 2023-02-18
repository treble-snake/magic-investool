// TODO: think about this file

export const STORAGE_DIR = process.env.STORAGE_DIR || '';
if (!STORAGE_DIR) {
  throw new Error('No storage directory set');
}

// APIs
export const BASE_ALPHAVANTAGE_URL = process.env.BASE_ALPHAVANTAGE_URL || 'https://www.alphavantage.co';
export const BASE_FINNHUB_URL = process.env.BASE_FINNHUB_URL || 'https://finnhub.io';