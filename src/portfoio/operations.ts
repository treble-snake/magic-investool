import {PortfolioStorage} from './storage/PortfolioStorage.types';
import {ActionType, HistoryStorage} from './storage/HistoryStorage.types';

export type AppContext = {
  portfolioStorage: PortfolioStorage,
  historyStorage: HistoryStorage,
};

export function portfolioOperations(context: AppContext) {
  return {
    async sell(
      ticker: string,
      pricePerShare: number,
      date?: Date
    ) {
      const {portfolioStorage, historyStorage} = context;
      const toRemove = await portfolioStorage.findByTicker(ticker);
      if (!toRemove) {
        return;
      }

      await historyStorage.addRecord({
        ticker,
        name: toRemove.name,
        type: ActionType.SELL,
        date: (date || new Date()).toISOString(),
        price: pricePerShare,
        qty: toRemove.sharesQty
      });

      return portfolioStorage.remove(ticker);
    }
  };
}