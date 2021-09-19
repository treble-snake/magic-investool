import {PortfolioCompany} from '../common/types/companies.types';
import {FileStorage} from '../storage/file';
import path from 'path';
import {STORAGE_DIR} from '../common/config';

type PortfolioStorage = {
  companies: PortfolioCompany[];
  lastUpdate: string;
}

// TODO: bad singleton, bad!
const STORAGE_FILE = path.join(STORAGE_DIR, 'portfolio.json');
const storage = new FileStorage<PortfolioStorage>(STORAGE_FILE);

export const readPortfolio = async () => {
  const data = await storage.read();
  return data ? data.companies : [];
};

export const writePortfolio = (companies: PortfolioCompany[]) => {
  return storage.write({
    lastUpdate: new Date().toISOString(),
    companies
  });
};