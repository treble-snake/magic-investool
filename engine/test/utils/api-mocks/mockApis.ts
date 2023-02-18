import {mockAlphaVantage} from './mockAlphaVantage';

// TODO: add Finnhub
export const mockApis = (...tickers: string[]) => {
  mockAlphaVantage(...tickers);
};