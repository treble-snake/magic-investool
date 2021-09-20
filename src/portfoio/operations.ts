import {ActionType} from './storage/HistoryStorage.types';
import {enrichCompany} from '../enrichment/enrichCompany';
import {AppContext} from '../context/context';

export function portfolioOperations(context: AppContext) {
  return {
    async sell(ticker: string, pricePerShare: number, date?: Date) {
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
    },
    async buy(ticker: string, qty: number, pricePerShare: number, date?: Date) {
      const {portfolioStorage, historyStorage} = context;
      const existing = await portfolioStorage.findByTicker(ticker);
      const purchaseDate = (date ?? new Date()).toISOString();
      let name = ticker;

      if (existing) {
        name = existing.name;
        await portfolioStorage
          .updateOne(ticker, {sharesQty: existing.sharesQty + qty});
      } else {
        const enriched = await enrichCompany({ticker, name: ticker});
        name = enriched.name;
        await portfolioStorage.add({
          ...enriched,
          sharesQty: qty,
          purchaseDate
        });
      }

      await historyStorage.addRecord({
        ticker,
        name,
        type: ActionType.BUY,
        date: purchaseDate,
        price: pricePerShare,
        qty
      });
    }
  };
}