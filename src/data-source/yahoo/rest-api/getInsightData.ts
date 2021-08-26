import {askYahoo} from './client';
import {FinanceResponse} from './types/insight';

const INSIGHTS_ENDPOINT = 'https://yfapi.net/ws/insights/v1/finance/insights';

export const getInsightData = async (ticker: string) => {
  return askYahoo(`${INSIGHTS_ENDPOINT}?${new URLSearchParams({
    symbol: ticker
  }).toString()}`) as Promise<FinanceResponse>;
};
