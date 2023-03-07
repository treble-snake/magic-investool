import {AppContext} from '../../context/context';
import {BASE_FINNHUB_URL} from '../../common/config';
import {request} from 'undici';
import {PriceQuote, RecommendationTrends} from './types/api';
import {logger} from '../../common/logging/logger';

type Props = {
  symbol: string
} | Record<string, string>;

export const makeFinnhubApi = (context: AppContext) => {
  let apiKey: string | null = null;

  const makeRequest = async <T>(endpoint: string, query: Props): Promise<T> => {
    if (apiKey === null) {
      apiKey = (await context.userAccountStorage.getAccountData()).finnhubApiKey;
    }

    const url = new URL(`/api/v1${endpoint}`, BASE_FINNHUB_URL).toString();
    const response = await request(
      url,
      {
        query,
        headers: {
          'X-Finnhub-Token': apiKey
        }
      }
    );

    const data = await response.body.json();

    if (response.statusCode !== 200) {
      if (response.statusCode === 429) {
        throw new Error(`${endpoint}: Too many requests to Finnhub`);
      }
      throw new Error(`${endpoint}: Failed to make request to Finnhub, code: ${response.statusCode}`);
    }

    return data;
  };

  return {
    async getPrice(ticker: string) {
      // https://finnhub.io/docs/api/quote
      return makeRequest<PriceQuote>('/quote', {
        symbol: ticker
      });
    },
    async getRecommendationTrends(ticker: string) {
      // https://finnhub.io/docs/api/recommendation-trends
      return makeRequest<RecommendationTrends>('/stock/recommendation', {
        symbol: ticker
      });
    }
  };
};

