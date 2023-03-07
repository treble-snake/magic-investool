import {FileStorage, makeFileStorage} from '../../storage/file';
import {MagicFormulaStorage} from './MagicFormulaStorage.types';
import {
  CompanyStock,
  PortfolioCompany
} from '../../common/types/companies.types';
import {omit} from 'ramda';
import {completeCompanyData} from '../../enrichment/completeCompanyData';

type MagicFormulaData = {
  companies: CompanyStock[];
  lastUpdate: string;
}

const MAGIC_FORMULA_FILENAME = 'mfState.json';

export const fileMagicFormulaStorage = (
  storage: FileStorage<MagicFormulaData> = makeFileStorage(MAGIC_FORMULA_FILENAME)
): MagicFormulaStorage => {
  return {
    async findAll(): Promise<CompanyStock[]> {
      const data = await storage.read();
      return (data?.companies ?? []).map(completeCompanyData);
    },
    save(companies: CompanyStock[]): Promise<void> {
      return storage.write({
        lastUpdate: new Date().toISOString(),
        companies
      });
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
    async findByTicker(ticker: string): Promise<CompanyStock | null> {
      const all = await this.findAll();
      return all.find(it => it.ticker === ticker) || null;
    },
  };
};
