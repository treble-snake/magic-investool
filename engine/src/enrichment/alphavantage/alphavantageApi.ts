import {AppContext} from '../../context/context';
import {BASE_ALPHAVANTAGE_URL} from '../../common/config';
import {request} from 'undici';
import {CompanyOverview} from './types/api';

type Props = {
  function: string,
  symbol: string
} | Record<string, string>;

export const alphavantageApi = (context: AppContext) => {
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
      throw new Error(`Failed to make request ${query.function} to AlphaVantage: ${data['Error Message']}`)
    }

    if (data['Note']) {
      if (typeof data['Note'] === 'string' && data['Note'].includes('frequency')) {
        // TODO: make a special class Exception ?
        throw new Error(`Too many requests to AlphaVantage`);
      }

      throw new Error(`Unexpected AlphaVantage response: ${data['Note']}`);
    }

    if (response.statusCode !== 200) {
      throw new Error(`Failed to make request ${query.function} to AlphaVantage: ${response.statusCode}`);
    }

    return data;
  };

  return {
    async getCompanyOverview(ticker: string) {
      const data = await makeRequest<CompanyOverview>({
        function: 'OVERVIEW',
        symbol: ticker
      });

      if (data.Symbol !== ticker) {
        throw new Error(`Data on company (ticker ${ticker}) not found`);
      }
      return data;
    }
  };
};

