import {
  CompanyStock,
  PortfolioCompany
} from '../../common/types/companies.types';

export interface MagicFormulaStorage {
  findAll(): Promise<CompanyStock[]>;

  save(records: CompanyStock[]): Promise<void>;

  updateOne(ticker: string, company: Partial<CompanyStock>): Promise<CompanyStock | null>;

  findByTicker(ticker: string): Promise<CompanyStock | null>;
}
