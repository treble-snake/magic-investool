import {AppContext} from '../../context/context';
import {BASE_ALPHAVANTAGE_URL} from '../../common/config';
import {request} from 'undici';
import {CompanyOverview, IncomeStatement} from './types/api';

type Props = {
  function: string,
  symbol: string
} | Record<string, string>;

export const makeAlphavantageApi = (context: AppContext) => {
  let apiKey: string | null = null;

  const makeRequest = async <T>(query: Props): Promise<T> => {
    if (apiKey === null) {
      apiKey = (await context.userAccountStorage.getAccountData()).alphavantageApiKey;
    }

    const urlParams = new URLSearchParams({...query, apikey: apiKey}).toString();
    const response = await request(
      new URL(`query/?${urlParams}`, BASE_ALPHAVANTAGE_URL).toString());

    const data = await response.body.json();

    if (data['Error Message']) {
      throw new Error(`${query.function}: Failed to make request to AlphaVantage: ${data['Error Message']}`)
    }

    if (data['Note']) {
      if (typeof data['Note'] === 'string' && data['Note'].includes('frequency')) {
        // TODO: make a special class Exception ?
        throw new Error(`${query.function}: Too many requests to AlphaVantage`);
      }

      throw new Error(`${query.function}: Unexpected AlphaVantage response: ${data['Note']}`);
    }

    if (response.statusCode !== 200) {
      throw new Error(`${query.function}: Failed to make request to AlphaVantage, code: ${response.statusCode}`);
    }

    if (data.Symbol !== query.symbol && data.symbol !== query.symbol) {
      throw new Error(`${query.function}: Data on company (ticker ${query.symbol}) not found`);
    }

    return data;
  };

  return {
    async getCompanyOverview(ticker: string) {
      return makeRequest<CompanyOverview>({
        function: 'OVERVIEW',
        symbol: ticker
      });
    },
    async getIncomeStatement(ticker: string) {
      // https://www.alphavantage.co/documentation/#income-statement
      return makeRequest<IncomeStatement>({
        function: 'INCOME_STATEMENT',
        symbol: ticker
      });
    }
  };
};

