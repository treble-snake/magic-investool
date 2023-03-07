import {getBreakEvenPrice} from '../../src/portfoio/getBreakEvenPrice';
import {
  ActionType,
  HistoryRecord
} from '../../src/portfoio/storage/HistoryStorage.types';

describe('getBreakEvenPrice', () => {
  it('should be 0 if there are no history records', () => {
    expect(getBreakEvenPrice([])).toEqual(0);
  });

  it('should be the price of a single buy', () => {
    expect(getBreakEvenPrice([{
      qty: 10,
      price: 100,
      type: ActionType.BUY
    } as HistoryRecord])).toEqual(100);
  });

  it('should be an average weighted price of several buys', () => {
    expect(getBreakEvenPrice([{
      qty: 10,
      price: 100,
      type: ActionType.BUY
    }, {
      qty: 10,
      price: 50,
      type: ActionType.BUY
    }] as HistoryRecord[])).toEqual(75);
  });


  it('should be 0 if everything is sold', () => {
    expect(getBreakEvenPrice([{
      qty: 10,
      price: 100,
      type: ActionType.BUY,
      date: '2021-01-03'
    }, {
      qty: 10,
      price: 110,
      type: ActionType.SELL,
      date: '2021-01-02'
    }] as HistoryRecord[])).toEqual(0);
  });

  it('should subtract a sell from the equation (single buy)', () => {
    expect(getBreakEvenPrice([{
      qty: 10,
      price: 100,
      type: ActionType.BUY,
      date: '2021-01-01'
    }, {
      qty: 10,
      price: 110,
      type: ActionType.SELL,
      date: '2021-01-02'
    }, {
      qty: 10,
      price: 50,
      type: ActionType.BUY,
      date: '2021-01-03'
    }] as HistoryRecord[])).toEqual(50);
  });

  it('should subtract a sell from the equation (several buys)', () => {
    expect(getBreakEvenPrice([{
      qty: 10,
      price: 100,
      type: ActionType.BUY,
      date: '2021-01-01'
    }, {
      qty: 5,
      price: 110,
      type: ActionType.BUY,
      date: '2021-01-02'
    }, {
      qty: 15,
      price: 100,
      type: ActionType.SELL,
      date: '2021-01-01'
    }, {
      qty: 3,
      price: 100,
      type: ActionType.BUY,
      date: '2021-01-02'
    }, {
      qty: 3,
      price: 50,
      type: ActionType.BUY,
      date: '2021-01-03'
    }] as HistoryRecord[])).toEqual(75);
  });
});