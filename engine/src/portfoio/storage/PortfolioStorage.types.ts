import {PortfolioCompany} from '../../common/types/companies.types';

export interface PortfolioStorage {
  findAll(): Promise<PortfolioCompany[]>;

  findByTicker(ticker: string): Promise<PortfolioCompany | null>;

  save(companies: PortfolioCompany[]): Promise<void>;

  updateOne(ticker: string, company: Partial<PortfolioCompany>): Promise<PortfolioCompany | null>;

  add(company: PortfolioCompany): Promise<PortfolioCompany>;

  remove(ticker: string): Promise<void>;
}
