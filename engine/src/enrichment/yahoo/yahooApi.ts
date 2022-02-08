import {QuoteSummaryResponse} from './types/ticker';
import {BASE_YAHOO_URL} from '../../common/config';
import {FinanceResponse} from './types/insight';
import {AppContext} from '../../context/context';
import {request} from 'undici';
import {logger} from '../../common/logging/logger';
import {makeKeyProvider} from './makeKeyProvider';

const COMPANY_DATA_PARAMS = new URLSearchParams({
  modules: 'assetProfile,quoteType,summaryDetail,financialData,defaultKeyStatistics,calendarEvents,incomeStatementHistory,incomeStatementHistoryQuarterly,cashflowStatementHistory,balanceSheetHistory,earnings,earningsHistory,insiderHolders,cashflowStatementHistory,cashflowStatementHistoryQuarterly,insiderTransactions,secFilings,indexTrend,earningsTrend,netSharePurchaseActivity,upgradeDowngradeHistory,institutionOwnership,recommendationTrend,balanceSheetHistory,balanceSheetHistoryQuarterly,fundOwnership,majorDirectHolders,majorHoldersBreakdown,price,esgScores',
  lang: 'en',
  region: 'US',
}).toString();

export const yahooApi = (context: AppContext) => {
  const apiKeyProvider = makeKeyProvider(context);

  const askYahoo = async <T>(url: string, prop?: keyof T): Promise<T> => {
    const absoluteUrl = new URL(url, BASE_YAHOO_URL).toString();
    let response: Awaited<ReturnType<typeof request>> | undefined;
    let apiKey: string | undefined;
    do {
      // meaning there was a previous iteration and the key didn't work
      if (apiKey && response) {
        logger.warn(`API key ${apiKey} is not working, reason: ${response.statusCode}`);
        // TODO: await not required, but without it we might have concurrent file writes
        await apiKeyProvider.reportKey(apiKey, `Status: ${response.statusCode}`);
      }

      apiKey = await apiKeyProvider.nextKey();
      response = await request(absoluteUrl, {
        method: 'GET',
        headers: {'x-api-key': apiKey}
      });
    } while (response.statusCode !== 200);

    const data = await response.body.json();
    const error = data[prop]?.error;
    if (error) {
      throw new Error(`Yahoo error(${error.code}): ${error.description}`);
    }
    return data;
  };

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
