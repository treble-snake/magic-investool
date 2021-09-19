export const STORAGE_DIR = process.env.STORAGE_DIR || '';
if (!STORAGE_DIR) {
  throw new Error('No storage directory set');
}

export const PORTFOLIO_FILENAME = process.env.PORTFOLIO_FILENAME || 'portfolio.json';
export const HISTORY_FILENAME = process.env.PORTFOLIO_FILENAME || 'history.json';
export const MAGIC_FORMULA_FILENAME = process.env.PORTFOLIO_FILENAME || 'mfState.json';
