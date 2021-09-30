export const STORAGE_DIR = process.env.STORAGE_DIR || '';
if (!STORAGE_DIR) {
  throw new Error('No storage directory set');
}

export const PORTFOLIO_FILENAME = process.env.PORTFOLIO_FILENAME || 'portfolio.json';
export const HISTORY_FILENAME = process.env.PORTFOLIO_FILENAME || 'history.json';
export const MAGIC_FORMULA_FILENAME = process.env.PORTFOLIO_FILENAME || 'mfState.json';

// APIs
export const YAHOO_API_KEY = process.env.YAHOO_API_KEY || '';
export const BASE_YAHOO_URL = process.env.BASE_YAHOO_URL || 'https://yfapi.net';
export const FINANCE_CACHE_THRESHOLD_HRS = Number(process.env.FINANCE_CACHE_THRESHOLD_HRS) || 24;