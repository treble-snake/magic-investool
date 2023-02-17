import {mockAlphaVantage} from './mockAlphaVantage';

export const mockApis = (...tickers: string[]) => {
  mockAlphaVantage(...tickers);
};