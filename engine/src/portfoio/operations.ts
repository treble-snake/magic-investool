import {ActionType} from './storage/HistoryStorage.types';
import {AppContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {countBy, mapObjIndexed} from 'ramda';
import {CompanyStock} from '../common/types/companies.types';

export const portfolioOperations = (context: AppContext) => ({
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
      const enriched = await enrichmentOperations(context)
        .enrichCompany({ticker, name: ticker});
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
  },
  async getSectors() {
    const companies = await context.portfolioStorage.findAll();
    const total = companies.length;
    return mapObjIndexed(
      (x: number): number => Math.round(100 * 100 * x / total) / 100,
      countBy((it: CompanyStock) => it.sector)(companies)
    );
  }
});