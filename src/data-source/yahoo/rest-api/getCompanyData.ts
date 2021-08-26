import {askYahoo} from './client';

const COMPANY_DATA_ENDPOINT = 'https://yfapi.net/v11/finance/quoteSummary/';

const PARAMS = new URLSearchParams({
  modules: 'summaryDetail,assetProfile,financialData,defaultKeyStatistics,calendarEvents,incomeStatementHistory,incomeStatementHistoryQuarterly,cashflowStatementHistory,balanceSheetHistory,earnings,earningsHistory,insiderHolders,cashflowStatementHistory,cashflowStatementHistoryQuarterly,insiderTransactions,secFilings,indexTrend,earningsTrend,netSharePurchaseActivity,upgradeDowngradeHistory,institutionOwnership,recommendationTrend,balanceSheetHistory,balanceSheetHistoryQuarterly,fundOwnership,majorDirectHolders,majorHoldersBreakdown,price,quoteType,esgScores',
  lang: 'en',
  region: 'US',
}).toString();

export const getCompanyData = (ticker: string) => {
  return askYahoo(
    `${new URL(ticker, COMPANY_DATA_ENDPOINT).toString()}?${PARAMS}`
  );
};