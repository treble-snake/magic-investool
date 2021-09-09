import {CompanyWithAnalytics} from '../common/companies';
import {FileStorage} from '../storage/file';

type PortfolioStorage = {
  companies: CompanyWithAnalytics[];
  lastUpdate: string;
}

// TODO: bad singleton, bad!
const storage = new FileStorage<PortfolioStorage>('_persistance_/storage/portfolio.json');

export const readPortfolio = async () => {
  const data = await storage.read();
  return data ? data.companies : [];
}

export const writePortfolio = (companies: CompanyWithAnalytics[]) => {
  return storage.write({
    lastUpdate: new Date().toISOString(),
    companies
  });
};