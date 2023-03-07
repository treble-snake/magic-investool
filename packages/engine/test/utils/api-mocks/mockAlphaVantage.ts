import {MockAgent} from 'undici';
import {BASE_ALPHAVANTAGE_URL,} from '../../../src/common/config';
import {dummyOverview} from '../../data-source/alphavantage/dummyOverview';
import {dummyIncome} from '../../data-source/alphavantage/dummyIncome';

export const mockAlphaVantage = (agent: MockAgent, tickers: string[]) => {
  const mockClient = agent.get(BASE_ALPHAVANTAGE_URL);

  tickers.forEach((ticker) => {
    mockClient.intercept({
      path: new RegExp(`\/query.*(?=.*symbol=${ticker})(?=.*function=OVERVIEW)`),
      method: 'GET',
    }).reply(200, dummyOverview(ticker));

    mockClient.intercept({
      path: new RegExp(`\/query.*(?=.*symbol=${ticker})(?=.*function=INCOME_STATEMENT)`),
      method: 'GET',
    }).reply(200, dummyIncome(ticker));
  });

};