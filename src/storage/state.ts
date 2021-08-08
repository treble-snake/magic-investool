import {readFile, writeFile} from 'fs/promises';
import {MagicCompany} from '../common/companies';

export const STORAGE = process.env.STORAGE;
export const STORAGE_FILE = process.env.STORAGE_FILE;
  if (!STORAGE_FILE) {
    throw new Error('No storage path');
  }

export const readState = async (): Promise<MagicCompany[]> => {
  try {
    const fd = await readFile(STORAGE_FILE);
    return JSON.parse(fd.toString()).companies;
  } catch (e) {
    console.error('Failed to read state', e);
    return [];
  }
}

export const writeState = (companies: MagicCompany[]) => {
  return writeFile(STORAGE_FILE, JSON.stringify({
    lastUpdate: new Date().toISOString(),
    companies
  }));
}