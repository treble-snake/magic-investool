import {UiPortfolioCompany} from '../cross-platform/types';

// TODO: memoize
export const getTotalPL = (companies: UiPortfolioCompany[]) => {
  let hasMissingValues = false;
  const plSum = companies.reduce((acc, it) => {
    if (!it.price || !it.breakEvenPrice) {
      hasMissingValues = true;
      return acc;
    }
    return acc + (it.price - it.breakEvenPrice) * it.sharesQty;
  }, 0);

  return {plSum, hasMissingValues};
};