import {ActionType, HistoryRecord} from './storage/HistoryStorage.types';
import {prop, sortBy} from 'ramda';

export const getBreakEvenPrice = (history: HistoryRecord[]) => {
  // how many stocks we actually own now
  let remainingQty = history.reduce((acc, it) => {
    return it.type === ActionType.BUY ? acc + it.qty : acc - it.qty;
  }, 0);

  // might be just ===, but <= for possible data issues
  if (remainingQty <= 0) {
    return 0;
  }

  const buyRecords = sortBy(prop('date'),
    history.filter(it => it.type === ActionType.BUY));

  let totalPrice = 0;
  let totalQty = 0;
  for (let i = buyRecords.length - 1; i >= 0; i--) {
    const {qty, price} = buyRecords[i];
    // if this purchase is owned completely, just add it to the total
    // otherwise use just a part of the purchase (the rest was obviously sold)
    if (qty <= remainingQty) {
      totalPrice += qty * price;
      totalQty += qty;
      remainingQty -= qty;
    } else {
      totalPrice += remainingQty * price;
      totalQty += remainingQty;
      break;
    }
  }

  return totalPrice / totalQty;
};