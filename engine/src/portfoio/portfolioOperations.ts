import {ActionType, HistoryRecord} from './storage/HistoryStorage.types';
import {AppContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {countBy} from 'ramda';
import {CompanyStock} from '../common/types/companies.types';
import {logger} from '../common/logging/logger';
import {getBreakEvenPrice} from './getBreakEvenPrice';

export type SectorQty = { name: string, qty: number };

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

    // can't partially sell now, so no need to recalculate BEP
    return portfolioStorage.remove(ticker);
  },
  async buy(ticker: string, qty: number, pricePerShare: number, date?: Date) {
    const {portfolioStorage, historyStorage} = context;
    let name = ticker;
    const purchaseDate = (date ?? new Date()).toISOString();
    const existing = await portfolioStorage.findByTicker(ticker);
    const newHistoryRecord = {
      ticker,
      name,
      type: ActionType.BUY,
      date: purchaseDate,
      price: pricePerShare,
      qty
    } as HistoryRecord;

    if (existing) {
      name = existing.name;
      const history = await historyStorage.findByTicker(ticker);
      const breakEvenPrice = getBreakEvenPrice(history.concat(newHistoryRecord));
      await portfolioStorage.updateOne(ticker, {
        sharesQty: existing.sharesQty + qty,
        purchaseDate,
        breakEvenPrice
      });
    } else {
      const enriched = await enrichmentOperations(context)
        .enrichCompany({ticker});
      name = enriched.name;
      await portfolioStorage.add({
        ...enriched,
        sharesQty: qty,
        purchaseDate,
        breakEvenPrice: pricePerShare
      });
    }

    await historyStorage.addRecord({...newHistoryRecord, name});
  },
  async getSectors() {
    const companies = await context.portfolioStorage.findAll();
    return Object.entries(countBy((it: CompanyStock) => it.sector)(companies))
      .reduce((acc, [name, qty]) => {
        return acc.concat({name, qty});
      }, [] as SectorQty[]);
  },
  async updateAll() {
    const {portfolioStorage} = context;
    const enrichmentOps = enrichmentOperations(context);
    const portfolio = await portfolioStorage.findAll();

    logger.info('Fetching financial data for portfolio');
    const enrichedCompanies = await Promise.all(portfolio
      .map(it => enrichmentOps.enrichCompany(it)));

    await portfolioStorage.save(enrichedCompanies);
  },
  async checkPrices() {
    const enrichmentOps = enrichmentOperations(context);
    const portfolio = await context.portfolioStorage.findAll();

    const alertsTriggered: string[] = [];
    const enrichedCompanies = await Promise.all(portfolio.map(async (it) => {
      if (!it.priceAlert?.price) {
        return it;
      }

      const oldPrice = it.price ?? 0;
      const alertPrice = it.priceAlert.price;
      // alert won't be triggered anyway, so no need to waste an API call
      if (oldPrice >= alertPrice) {
        return it;
      }

      // TODO: might be only 1 yahoo-to-be-removed request, not both (basic + insights)
      const updated = await enrichmentOps.enrichCompany(it);
      if ((updated.price ?? 0) >= alertPrice) {
        alertsTriggered.push(it.ticker);
      }

      return updated;
    }));

    await context.portfolioStorage.save(enrichedCompanies);
    return alertsTriggered;
  }
});