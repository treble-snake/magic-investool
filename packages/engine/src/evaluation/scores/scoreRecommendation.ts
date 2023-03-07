import {RecommendationData} from '../../common/types/ranking.types';

export const scoreRecommendation = (data: RecommendationData) => {
  const {trend} = data;
  return 1.5 * trend.strongBuy +
    trend.buy -
    trend.sell -
    1.5 * trend.strongSell;
};