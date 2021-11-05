import {PortfolioCompany} from '../../common/types/companies.types';
import {FileStorage, makeFileStorage} from '../../storage/file';
import {PortfolioStorage} from './PortfolioStorage.types';
import {omit} from 'ramda';

type PortfolioData = {
  companies: PortfolioCompany[];
  lastUpdate: string;
}

const PORTFOLIO_FILENAME = 'portfolio.json';

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
    },
    async updateOne(ticker: string, company: Partial<PortfolioCompany>) {
      const all = await this.findAll();
      const existing = all.find(it => it.ticker === ticker);
      if (!existing) {
        return null;
      }
      Object.assign(existing, omit(['ticker'], company));
      await this.save(all);
      return existing;
    },
    async add(company: PortfolioCompany) {
      const all = await this.findAll();
      const existing = all.find(it => it.ticker === company.ticker);
      if (existing) {
        throw new Error(`${company.ticker} already exists`);
      }

      all.push(company);
      await this.save(all);
      return company;
    }
  };
};
