import {PortfolioCompany} from '../../common/types/companies.types';

export interface PortfolioStorage {
  findAll(): Promise<PortfolioCompany[]>;

  save(companies: PortfolioCompany[]): Promise<void>;

  remove(ticker: string): Promise<PortfolioCompany[]>;
}
