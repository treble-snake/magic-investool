import {UiPortfolioCompany} from '../../pages/api/portfolio';

// TODO: memoize
export const getTotalPL = (companies: UiPortfolioCompany[]) => {
  return companies.reduce((acc, it) => {
    if (!it.price || !it.breakEvenPrice) {
      return acc;
    }
    return acc + (it.price - it.breakEvenPrice) * it.sharesQty;
  }, 0);
};