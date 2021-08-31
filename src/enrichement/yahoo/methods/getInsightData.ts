import {askYahoo} from '../client';
import {FinanceResponse} from '../types/insight';

const INSIGHTS_ENDPOINT = '/ws/insights/v1/finance/insights';

export const getInsightData = (ticker: string) => {
  const urlParams = new URLSearchParams({symbol: ticker}).toString();
  return askYahoo<FinanceResponse>(
    `${INSIGHTS_ENDPOINT}?${urlParams}`,
    'finance'
  );
};
