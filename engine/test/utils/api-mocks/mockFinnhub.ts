import {MockAgent} from 'undici';
import {BASE_FINNHUB_URL,} from '../../../src/common/config';
import {dummyPriceQuote} from '../../data-source/finnhub/dummyPriceQuote';
import {
  dummyRecommendations
} from '../../data-source/finnhub/dummyRecommendations';

export const mockFinnhub = (agent: MockAgent, tickers: string[]) => {
  const mockClient = agent.get(BASE_FINNHUB_URL);

  tickers.forEach((ticker) => {
    mockClient.intercept({
      path: new RegExp(`\/quote.*symbol=${ticker}`),
      method: 'GET',
    }).reply(200, dummyPriceQuote);

    mockClient.intercept({
      path: new RegExp(`\/stock/recommendation.*symbol=${ticker}`),
      method: 'GET',
    }).reply(200, dummyRecommendations(ticker));
  });

};