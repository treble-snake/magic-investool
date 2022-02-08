import {MockAgent, setGlobalDispatcher} from 'undici';
import {BASE_YAHOO_URL} from '../../src/common/config';
import {dummyQuoteSummary} from '../data-source/yahoo/dummyQuoteSummary';
import {dummyInsight} from '../data-source/yahoo/dummyInsight';

export const mockYahooApi = (ticker: string) => {
  const mockAgent = new MockAgent({connections: 1});
  const mockClient = mockAgent.get(BASE_YAHOO_URL);
  setGlobalDispatcher(mockAgent);

  mockClient.intercept({
    path: /finance\/quoteSummary/,
    method: 'GET',
  }).reply(200, dummyQuoteSummary(ticker));
  mockClient.intercept({
    path: /finance\/insights/,
    method: 'GET',
  }).reply(200, dummyInsight(ticker));

}