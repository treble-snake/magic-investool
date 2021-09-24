import {askYahoo} from '../httpClient';
import {FinanceResponse} from '../types/insight';

const INSIGHTS_ENDPOINT = '/ws/insights/v1/finance/insights';

export const getInsightData = async (ticker: string) => {
  const urlParams = new URLSearchParams({symbol: ticker}).toString();
  const financeResponse = await askYahoo<FinanceResponse>(
    `${INSIGHTS_ENDPOINT}?${urlParams}`,
    'finance'
  );

  return financeResponse.finance.result;
};
