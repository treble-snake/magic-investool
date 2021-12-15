import {getYahooClient} from './httpClient';
import {QuoteSummaryResponse} from './types/ticker';
import {BASE_YAHOO_URL} from '../../common/config';
import {FinanceResponse} from './types/insight';
import {AppContext} from '../../context/context';

const COMPANY_DATA_PARAMS = new URLSearchParams({
  modules: 'assetProfile,quoteType,summaryDetail,financialData,defaultKeyStatistics,calendarEvents,incomeStatementHistory,incomeStatementHistoryQuarterly,cashflowStatementHistory,balanceSheetHistory,earnings,earningsHistory,insiderHolders,cashflowStatementHistory,cashflowStatementHistoryQuarterly,insiderTransactions,secFilings,indexTrend,earningsTrend,netSharePurchaseActivity,upgradeDowngradeHistory,institutionOwnership,recommendationTrend,balanceSheetHistory,balanceSheetHistoryQuarterly,fundOwnership,majorDirectHolders,majorHoldersBreakdown,price,esgScores',
  lang: 'en',
  region: 'US',
}).toString();

export const yahooApi = (context: AppContext) => {
  const getApiKey = () => context.userAccountStorage
    .getAccountData()
    .then(it => it.yahooApiKey);
  const askYahoo = getYahooClient(getApiKey, BASE_YAHOO_URL);

  return {
    getCompanyData: async (ticker: string) => {
      const response = await askYahoo<QuoteSummaryResponse>(
        `/v11/finance/quoteSummary/${ticker}?${COMPANY_DATA_PARAMS}`,
        'quoteSummary'
      );

      const data = response.quoteSummary.result
        .find(it => it.quoteType?.symbol === ticker);

      if (!data) {
        throw new Error(`Data on company (ticker ${ticker}) not found`);
      }

      return data;
    },
    getInsightData: async (ticker: string) => {
      const urlParams = new URLSearchParams({symbol: ticker}).toString();
      const financeResponse = await askYahoo<FinanceResponse>(
        `/ws/insights/v1/finance/insights?${urlParams}`,
        'finance'
      );

      return financeResponse.finance.result;
    }
  };
};
