import {PortfolioCompany} from '../../common/types/companies.types';

export interface PortfolioStorage {
  findAll(): Promise<PortfolioCompany[]>;

  findByTicker(ticker: string): Promise<PortfolioCompany | null>;

  save(companies: PortfolioCompany[]): Promise<void>;

  remove(ticker: string): Promise<void>;
}
