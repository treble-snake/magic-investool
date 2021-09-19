export const STORAGE_DIR = process.env.STORAGE_DIR || '';
if (!STORAGE_DIR) {
  throw new Error('No storage directory set');
}