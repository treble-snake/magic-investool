import {CompanyStock} from '../../common/types/companies.types';

export const scorePrice = (company: CompanyStock) => {
  const price = company.prices.data.current || company.price || 0;
  const target = company.prices.data.target || company.overview.analystTargetPrice || 0;
  if (price === 0 || target === 0) {
    return 0;
  }

  return target / price;
};