import {readFile, writeFile} from 'fs/promises';
import {CompanyWithAnalytics, CoreCompany} from '../../common/companies';
import {logger} from '../../common/logging/logger';

export const STORAGE = process.env.STORAGE;
export const STORAGE_FILE = process.env.STORAGE_FILE;
if (!STORAGE_FILE) {
  throw new Error('No storage path');
}

export const readState = async (file = STORAGE_FILE): Promise<CompanyWithAnalytics[]> => {
  try {
    const fd = await readFile(file);
    return JSON.parse(fd.toString()).companies;
  } catch (e) {
    logger.error('Failed to read state', e);
    return [];
  }
};

export const writeState = (companies: CoreCompany[], file = STORAGE_FILE) => {
  return writeFile(file, JSON.stringify({
    lastUpdate: new Date().toISOString(),
    companies
  }));
};