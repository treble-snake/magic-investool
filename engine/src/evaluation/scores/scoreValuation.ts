import {CompanyStock} from '../../common/types/companies.types';

// TODO: rename and rework this
export const scoreValuation = (company: CompanyStock) => {
  const price = company.price || 0;
  const target = company.overview.analystTargetPrice || 0;
  if (price === 0 || target === 0) {
    return 0;
  }

  return target / price;
};