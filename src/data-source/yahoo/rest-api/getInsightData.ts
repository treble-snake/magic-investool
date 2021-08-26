import {askYahoo} from './client';

const INSIGHTS_ENDPOINT = 'https://yfapi.net/ws/insights/v1/finance/insights';

export const getInsightData = async (ticker: string) => {
  return askYahoo(`${INSIGHTS_ENDPOINT}?${new URLSearchParams({
    symbol: ticker
  }).toString()}`);
};
