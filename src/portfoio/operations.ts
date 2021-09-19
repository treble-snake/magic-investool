import {PortfolioStorage} from './storage/PortfolioStorage.types';

export type AppContext = {
  portfolioStorage: PortfolioStorage
};

export function portfolioOperations (context: AppContext) {
  return {
    sell(
      ticker: string,
      pricePerShare: number,
      date?: Date
    ) {

      return context.portfolioStorage.remove(ticker);
    }
  };
}