import {CompanyStock} from '../../common/companies';
import {FileStorage} from '../../storage/file';
import path from 'path';
import {STORAGE_DIR} from '../../common/config';

type MagicFormulaStorage = {
  companies: CompanyStock[];
  lastUpdate: string;
}

// TODO: bad singleton, bad!
const STORAGE_FILE = path.join(STORAGE_DIR, 'mfState.json');
const storage = new FileStorage<MagicFormulaStorage>(STORAGE_FILE);

export const readMfState = async () => {
  const data = await storage.read();
  return data ? data.companies : [];
};

export const writeMfState = (companies: CompanyStock[]) => {
  return storage.write({
    lastUpdate: new Date().toISOString(),
    companies
  });
};