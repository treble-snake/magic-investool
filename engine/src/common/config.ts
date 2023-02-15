// TODO: think about this file

export const STORAGE_DIR = process.env.STORAGE_DIR || '';
if (!STORAGE_DIR) {
  throw new Error('No storage directory set');
}

// APIs
/** @deprecated */
export const BASE_YAHOO_URL = process.env.BASE_YAHOO_URL || 'https://yfapi.net';
export const BASE_ALPHAVANTAGE_URL = process.env.BASE_ALPHAVANTAGE_URL || 'https://www.alphavantage.co';