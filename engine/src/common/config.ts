export const STORAGE_DIR = process.env.STORAGE_DIR || '';
if (!STORAGE_DIR) {
  throw new Error('No storage directory set');
}

// APIs
export const YAHOO_API_KEY = process.env.YAHOO_API_KEY || '';
export const BASE_YAHOO_URL = process.env.BASE_YAHOO_URL || 'https://yfapi.net';
export const FINANCE_CACHE_THRESHOLD_HRS = Number(process.env.FINANCE_CACHE_THRESHOLD_HRS) || 24;