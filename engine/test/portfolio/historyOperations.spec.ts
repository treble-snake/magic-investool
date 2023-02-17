import {PortfolioCompany} from '../../src/common/types/companies.types';
import {
  filePortfolioStorage
} from '../../src/portfoio/storage/FilePortfolioStorage';
import {makeEmptyCompany} from '../../src/enrichment/makeEmptyCompany';
import {
  fileHistoryStorage
} from '../../src/portfoio/storage/FileHistoryStorage';
import {fakeFileStorage} from '../utils/fakeFileStorage';
import {fakeContext} from '../utils/fakeContext';
import {
  ActionType,
  HistoryRecord
} from '../../src/portfoio/storage/HistoryStorage.types';
import {historyOperations} from '../../src';
import {mockApis} from '../utils/api-mocks/mockApis';


describe('history operations', () => {
  function createContext(companies: Partial<PortfolioCompany>[], history: Partial<HistoryRecord>[]) {
    const portfolio = fakeFileStorage({
      lastUpdate: 'xxx',
      companies: companies.map(it => makeEmptyCompany(it as PortfolioCompany))
    });
    return {
      ...fakeContext(),
      portfolioStorage: filePortfolioStorage(portfolio),
      historyStorage: fileHistoryStorage(fakeFileStorage(history as HistoryRecord[]))
    };
  }

  describe('delete', () => {
    it('should decrease shares number when removing a buy', async () => {
      const context = createContext([
        {ticker: 'BANG', name: 'Bang', sharesQty: 42}
      ], [
        {id: 'id1', qty: 40, ticker: 'BANG', type: ActionType.BUY},
        {id: 'id2', qty: 2, ticker: 'BANG', type: ActionType.BUY}
      ]);
      await historyOperations(context).delete('id2');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.sharesQty).toEqual(40);
    });

    it('should update BEP when removing a buy', async () => {
      const context = createContext([
        {ticker: 'BANG', name: 'Bang', sharesQty: 20, breakEvenPrice: 0}
      ], [
        {id: 'id1', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id2', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 200}
      ]);
      await historyOperations(context).delete('id2');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.sharesQty).toEqual(10);
      expect(item?.breakEvenPrice).toEqual(100);
    });

    it('should remove a company from portfolio when all buy records are removed', async () => {
      const context = createContext([
        {ticker: 'BANG', name: 'Bang', sharesQty: 42},
        {ticker: 'ABC', name: 'Abc', sharesQty: 142}
      ], [
        {id: 'id1', qty: 142, ticker: 'ABC', type: ActionType.BUY},
        {id: 'id2', qty: 42, ticker: 'BANG', type: ActionType.BUY}
      ]);
      await historyOperations(context).delete('id2');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item).toEqual(null);
    });

    it('should restore removed company in portfolio when removing a sell', async () => {
      mockApis('BANG');
      const context = createContext([
        {ticker: 'ABC', name: 'Abc', sharesQty: 142}
      ], [
        {id: 'id1', qty: 142, ticker: 'ABC', type: ActionType.BUY},
        {id: 'id2', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id3', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 200},
        {id: 'id4', qty: 20, ticker: 'BANG', type: ActionType.SELL}
      ]);
      await historyOperations(context).delete('id4');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.sharesQty).toEqual(20);
      expect(item?.breakEvenPrice).toEqual(150);
    });

    it('should increase shares qty in portfolio when removing a sell', async () => {
      const context = createContext([
        {ticker: 'ABC', name: 'Abc', sharesQty: 142},
        {ticker: 'BANG', name: 'Bang', sharesQty: 20},
      ], [
        {id: 'id1', qty: 142, ticker: 'ABC', type: ActionType.BUY},
        {id: 'id2', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id3', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 200},
        {id: 'id4', qty: 20, ticker: 'BANG', type: ActionType.SELL},
        {id: 'id5', qty: 20, ticker: 'BANG', type: ActionType.BUY, price: 200}
      ]);
      await historyOperations(context).delete('id4');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.sharesQty).toEqual(40);
      expect(item?.breakEvenPrice).toEqual(175);
    });

    it('should set purchase date of the latest buy when changing qty', async () => {
      const context = createContext([
        {
          ticker: 'BANG',
          name: 'Bang',
          sharesQty: 20,
          purchaseDate: '2020-02-02'
        },
      ], [
        {
          id: 'id1',
          qty: 142,
          ticker: 'BANG',
          type: ActionType.BUY,
          date: '2020-01-01'
        },
        {
          id: 'id2',
          qty: 10,
          ticker: 'BANG',
          type: ActionType.BUY,
          date: '2020-02-02'
        },
      ]);
      await historyOperations(context).delete('id2');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.purchaseDate).toEqual('2020-01-01');
    });

    it('should set purchase date of the latest buy when recreating item', async () => {
      mockApis('BANG');
      const context = createContext([], [
        {
          id: 'id1',
          qty: 142,
          ticker: 'BANG',
          type: ActionType.BUY,
          date: '2020-01-01'
        },
        {
          id: 'id2',
          qty: 142,
          ticker: 'BANG',
          type: ActionType.SELL,
          date: '2020-02-02'
        },
      ]);
      await historyOperations(context).delete('id2');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.purchaseDate).toEqual('2020-01-01');
    });

    it('should not do anything if resulting qty is still zero or below', async () => {
      const context = createContext([], [
        {id: 'id1', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id2', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 200},
        {id: 'id3', qty: 20, ticker: 'BANG', type: ActionType.SELL},
      ]);
      await historyOperations(context).delete('id1');
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item).toEqual(null);
    });
  });

  describe('update', () => {
    it('should not do anything updating non-existing record', async () => {
      const context = createContext([
        {ticker: 'BANG', name: 'Bang', sharesQty: 10, breakEvenPrice: 100},
      ], [
        {id: 'id1', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
      ]);
      await historyOperations(context).updateOne('id2', {qty: 42, price: 200});
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item).toEqual(
        expect.objectContaining({sharesQty: 10, breakEvenPrice: 100}));
      const history = await context.historyStorage.findAll();
      expect(history).toEqual([
        {id: 'id1', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
      ]);
    });

    it('should update BEP if buy price is changed', async () => {
      const context = createContext([
        {ticker: 'BANG', name: 'Bang', sharesQty: 20, breakEvenPrice: 100},
      ], [
        {id: 'id2', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id3', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
      ]);
      await historyOperations(context).updateOne('id2', {price: 200});
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.breakEvenPrice).toEqual(150);
    });

    it('should update shares qty if buy qty is changed', async () => {
      const context = createContext([
        {ticker: 'BANG', name: 'Bang', sharesQty: 30, breakEvenPrice: 0},
      ], [
        {id: 'id2', qty: 20, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id3', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 200},
      ]);
      await historyOperations(context).updateOne('id2', {qty: 10});
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.sharesQty).toEqual(20);
      expect(item?.breakEvenPrice).toEqual(150);
    });

    it('should remove portfolio if no shares left', async () => {
      const context = createContext([
        {ticker: 'BANG', name: 'Bang', sharesQty: 10, breakEvenPrice: 0},
      ], [
        {id: 'id1', qty: 20, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id3', qty: 20, ticker: 'BANG', type: ActionType.SELL, price: 200},
        {id: 'id2', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 200},
      ]);
      await historyOperations(context).updateOne('id1', {qty: 10});
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item).toEqual(null);
    });

    it('should restore portfolio item if shares come back from 0', async () => {
      mockApis('BANG');
      const context = createContext([], [
        {id: 'id1', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
        {id: 'id2', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 200},
        {id: 'id3', qty: 20, ticker: 'BANG', type: ActionType.SELL, price: 100},
      ]);
      await historyOperations(context).updateOne('id1', {qty: 20});
      const item = await context.portfolioStorage.findByTicker('BANG');
      expect(item?.sharesQty).toEqual(10);
      expect(item?.breakEvenPrice).toEqual(100);
    });

    it('should not let edit ticker', async () => {
      const context = createContext([], [
        {id: 'id1', qty: 10, ticker: 'BANG', type: ActionType.BUY, price: 100},
      ]);
      await expect(
        historyOperations(context).updateOne('id1', {ticker: 'TEST'})
      ).rejects.toBeInstanceOf(Error);
    });

    it('should not let edit date', async () => {
      const context = createContext([], [
        {
          id: 'id1',
          qty: 10,
          ticker: 'BANG',
          type: ActionType.BUY,
          price: 100,
          date: '2021-01-01'
        },
      ]);
      await expect(
        historyOperations(context).updateOne('id1', {date: '2020-01-01'})
      ).rejects.toBeInstanceOf(Error);
    });
  });
});