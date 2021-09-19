import {PortfolioCompany} from '../../common/types/companies.types';
import {FileStorage, makeFileStorage} from '../../storage/file';
import {PORTFOLIO_FILENAME} from '../../common/config';
import {PortfolioStorage} from './PortfolioStorage.types';

type PortfolioData = {
  companies: PortfolioCompany[];
  lastUpdate: string;
}

export const filePortfolioStorage = (
  fileStorage: FileStorage<PortfolioData> = makeFileStorage(PORTFOLIO_FILENAME)
): PortfolioStorage => {
  return {
    async findAll() {
      const data = await fileStorage.read();
      return data?.companies ?? [];
    },
    async save(companies: PortfolioCompany[]) {
      return fileStorage.write({
        lastUpdate: new Date().toISOString(),
        companies
      });
    },
    async remove(ticker: string) {
      const companies = await this.findAll();
      const newCompanies = companies.filter(it => it.ticker !== ticker);
      if (companies.length !== newCompanies.length) {
        return this.save(newCompanies);
      }
    },
    async findByTicker(ticker: string): Promise<PortfolioCompany | null> {
      const all = await this.findAll();
      return all.find(it => it.ticker === ticker) || null;
    }
  };
};