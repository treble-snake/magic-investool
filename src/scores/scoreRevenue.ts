import {RevenueData} from '../common/companies';
import {filter} from 'ramda';

export const scoreRevenue = (data: RevenueData[]) => {
  if (data.length < 2) {
    // No info
    return -100;
  }

  const sorted = data
    .filter(it => it.value)
    .sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);

  let sum = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const current = sorted[i];
    let diff = (current.value - prev.value) / prev.value;

    // bump up the last year if it's not the only one
    if (i === sorted.length - 1 && sorted.length > 2) {
      diff = diff * 1.5;
    }
    sum += diff;
  }
  return sum / (sorted.length - 1);
};