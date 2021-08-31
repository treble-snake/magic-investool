import {askYahoo} from '../client';
import {QuoteSummaryResponse} from '../types/ticker';

const COMPANY_DATA_ENDPOINT = '/v11/finance/quoteSummary';

const PARAMS = new URLSearchParams({
  modules: 'summaryDetail,assetProfile,financialData,defaultKeyStatistics,calendarEvents,incomeStatementHistory,incomeStatementHistoryQuarterly,cashflowStatementHistory,balanceSheetHistory,earnings,earningsHistory,insiderHolders,cashflowStatementHistory,cashflowStatementHistoryQuarterly,insiderTransactions,secFilings,indexTrend,earningsTrend,netSharePurchaseActivity,upgradeDowngradeHistory,institutionOwnership,recommendationTrend,balanceSheetHistory,balanceSheetHistoryQuarterly,fundOwnership,majorDirectHolders,majorHoldersBreakdown,price,quoteType,esgScores',
  lang: 'en',
  region: 'US',
}).toString();

export const getCompanyData = (ticker: string) => {
  return askYahoo<QuoteSummaryResponse>(
    `${COMPANY_DATA_ENDPOINT}/${ticker}?${PARAMS}`,
    'quoteSummary'
  );
};