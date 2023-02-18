import {mockAlphaVantage} from './mockAlphaVantage';
import {MockAgent, setGlobalDispatcher} from 'undici';
import {mockFinnhub} from './mockFinnhub';

export const mockApis = (...tickers: string[]) => {
  const mockAgent = new MockAgent({connections: 1});

  mockAlphaVantage(mockAgent, tickers);
  mockFinnhub(mockAgent, tickers);

  setGlobalDispatcher(mockAgent);
  mockAgent.disableNetConnect();
};