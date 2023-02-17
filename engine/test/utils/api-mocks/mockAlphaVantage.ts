import {MockAgent, setGlobalDispatcher} from 'undici';
import {BASE_ALPHAVANTAGE_URL,} from '../../../src/common/config';
import {dummyOverview} from '../../data-source/alphaVantage/dummyOverview';

export const mockAlphaVantage = (...tickers: string[]) => {
  const mockAgent = new MockAgent({connections: 1});
  const mockClient = mockAgent.get(BASE_ALPHAVANTAGE_URL);
  setGlobalDispatcher(mockAgent);
  mockAgent.disableNetConnect();

  tickers.forEach((ticker) => {
    mockClient.intercept({
      path: new RegExp(`\/query.*(?=.*symbol=${ticker})(?=.*function=OVERVIEW)`),
      method: 'GET',
    }).reply(200, dummyOverview(ticker));

    mockClient.intercept({
      path: new RegExp(`\/query.*(?=.*symbol=${ticker})(?=.*function=INCOME_STATEMENT)`),
      method: 'GET',
    }).reply(200, {});
  });

};