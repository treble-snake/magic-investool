import {
  CompanyIndicator,
  RecommendationData
} from '../../../common/types/ranking.types';
import {RecommendationTrends} from '../types/api';

export const processRecommendation = (trends: RecommendationTrends): CompanyIndicator<RecommendationData> => {
  const data: RecommendationData = {
    trend: {
      date: '',
      strongBuy: 0,
      buy: 0,
      hold: 0,
      sell: 0,
      strongSell: 0
    }
  };
  if (trends.length > 0) {
    // TODO: maybe sort trends to make sure we got the latest?
    const {hold, buy, strongBuy, strongSell, sell, period} = trends[0];
    data.trend = {hold, buy, strongBuy, strongSell, sell, date: period};
  }

  return {
    score: 0,
    data
  };
};
