import {ActionType, HistoryRecord} from './storage/HistoryStorage.types';
import {AppContext} from '../context/context';
import {getBreakEvenPrice} from './getBreakEvenPrice';
import {enrichmentOperations} from '../enrichment/operations';
import {filter, last, pipe, prop, propEq, sortBy} from 'ramda';

export const historyOperations = (context: AppContext) => {

  const recalculatePortfolio = async (ticker: string) => {
    const {portfolioStorage, historyStorage} = context;
    const [portfolioItem, allHistory] = await Promise.all([
      portfolioStorage.findByTicker(ticker),
      historyStorage.findByTicker(ticker)
    ]);

    const newQty = allHistory.reduce((sum, {type, qty}) =>
      type === ActionType.BUY ? sum + qty : sum - qty, 0);

    if (newQty <= 0 && !portfolioItem) {
      return; // no action needed
    }

    if (newQty <= 0 && portfolioItem) {
      return context.portfolioStorage.remove(ticker);
    }

    // TODO: optimize? calculate only when needed
    const lastRecords = pipe(
      filter(propEq('type', ActionType.BUY)),
      sortBy<HistoryRecord>(prop('date')),
      <(a: HistoryRecord[]) => HistoryRecord>last
    )(allHistory);

    if (newQty > 0 && !portfolioItem) {
      const enriched = await enrichmentOperations(context)
        .enrichCompany({ticker});
      return portfolioStorage.add({
        ...enriched,
        sharesQty: newQty,
        purchaseDate: lastRecords?.date,
        breakEvenPrice: getBreakEvenPrice(allHistory),
      });
    }

    await context.portfolioStorage.updateOne(ticker, {
      breakEvenPrice: getBreakEvenPrice(allHistory),
      purchaseDate: lastRecords?.date,
      sharesQty: newQty
    });
  };

  return {
    /**
     * Updates a history item and chaning portfolio state accordingly.
     * Only price and quantity are allowed to be updated.
     * Might remove, reinstate or recalculate portfolio items.
     * @param id
     * @param data
     */
    async updateOne(id: string, data: Partial<Omit<HistoryRecord, 'id'>>) {
      const oldRecord = await context.historyStorage.findById(id);
      if (!oldRecord) {
        return;
      }

      if (data.ticker && oldRecord.ticker !== data.ticker) {
        throw new Error('Changing ticker is not allowed');
      }

      if (data.date && oldRecord.date !== data.date) {
        throw new Error('Changing date is not allowed');
      }

      await context.historyStorage.updateRecord(id, data);

      // potentially we could check:
      // if no price nor qty changed, we can do nothing
      // if just price (but no qty) change, we might do lighter update (just BEP)
      return recalculatePortfolio(oldRecord.ticker);
    },
    /**
     * Removes a history item and chaning portfolio state accordingly.
     * Might remove, reinstate or recalculate portfolio items.
     * @param id
     */
    async delete(id: string) {
      const oldRecord = await context.historyStorage.deleteRecord(id);
      if (oldRecord) {
        return recalculatePortfolio(oldRecord.ticker);
      }
    }
  };
};