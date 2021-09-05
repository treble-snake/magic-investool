import {ValuationData, ValuationType} from '../common/companies';

export const scoreValuation = (data: ValuationData) => {
  switch (data.type) {
    case ValuationType.NearFair:
      return 0;
    case ValuationType.Undervalued:
      return data.percentage;
    case ValuationType.Overvalued:
      return -1 * data.percentage;
    default:
      return -100;
  }
};