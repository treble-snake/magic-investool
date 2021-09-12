import {readFile, writeFile} from 'fs/promises';
import {CompanyWithAnalytics, CoreCompany} from '../../common/companies';
import {logger} from '../../common/logging/logger';
import {FileStorage} from '../../storage/file';

const STORAGE = process.env.STORAGE;
const STORAGE_FILE = process.env.STORAGE_FILE;
if (!STORAGE_FILE) {
  throw new Error('No storage path');
}

type MagicFormulaStorage = {
  companies: CompanyWithAnalytics[];
  lastUpdate: string;
}

// TODO: bad singleton, bad!
const storage = new FileStorage<MagicFormulaStorage>(STORAGE_FILE);

export const readState = async () => {
  const data = await storage.read();
  return data ? data.companies : [];
};

export const writeState = (companies: CompanyWithAnalytics[]) => {
  return storage.write({
    lastUpdate: new Date().toISOString(),
    companies
  });
};