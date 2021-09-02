import {askYahoo} from '../client';
import {QuoteSummaryResponse} from '../types/ticker';

const COMPANY_DATA_ENDPOINT = '/v11/finance/quoteSummary';

const PARAMS = new URLSearchParams({
  modules: 'assetProfile,quoteType,summaryDetail,financialData,defaultKeyStatistics,calendarEvents,incomeStatementHistory,incomeStatementHistoryQuarterly,cashflowStatementHistory,balanceSheetHistory,earnings,earningsHistory,insiderHolders,cashflowStatementHistory,cashflowStatementHistoryQuarterly,insiderTransactions,secFilings,indexTrend,earningsTrend,netSharePurchaseActivity,upgradeDowngradeHistory,institutionOwnership,recommendationTrend,balanceSheetHistory,balanceSheetHistoryQuarterly,fundOwnership,majorDirectHolders,majorHoldersBreakdown,price,esgScores',
  lang: 'en',
  region: 'US',
}).toString();

export const getCompanyData = async (ticker: string) => {
  const response = await askYahoo<QuoteSummaryResponse>(
    `${COMPANY_DATA_ENDPOINT}/${ticker}?${PARAMS}`,
    'quoteSummary'
  );

  const data = response.quoteSummary.result
    .find(it => it.quoteType?.symbol === ticker);

  if (!data) {
    throw new Error(`Data on company (ticker ${ticker}) not found`);
  }

  return data;
};