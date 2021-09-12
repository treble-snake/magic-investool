import {InsightRecommendationType, RecommendationData} from '../common/ranking';

const INSIGHT_RESULT = Object.freeze({
  [InsightRecommendationType.Sell]: -1,
  [InsightRecommendationType.Hold]: 0,
  [InsightRecommendationType.Unknown]: 0,
  [InsightRecommendationType.Buy]: 1,
});

export const scoreRecommendation = (data: RecommendationData) => {
  const {trend, insight} = data;
  return 1.5 * (INSIGHT_RESULT[insight.type] || 0) +
    1.5 * trend.strongBuy +
    trend.strongBuy -
    trend.sell -
    1.5 * trend.strongSell;
};