import {portfolioOperations} from '../../src/portfoio/operations';
import {
  CoreCompany,
  PortfolioCompany
} from '../../src/common/types/companies.types';
import {filePortfolioStorage} from '../../src/portfoio/storage/FilePortfolioStorage';
import {makeEmptyCompany} from '../../src/enrichment/makeEmptyCompany';
import {fileHistoryStorage} from '../../src/portfoio/storage/FileHistoryStorage';
import {MockAgent, setGlobalDispatcher} from 'undici';
import {BASE_YAHOO_URL} from '../../src/common/config';
import {dummyQuoteSummary} from '../data-source/yahoo/dummyQuoteSummary';
import {dummyInsight} from '../data-source/yahoo/dummyInsight';
import {defaultContext} from '../../src/context/context';
import {fakeFileStorage} from '../utils/fakeFileStorage';

describe('portfolio operations', () => {
  it('should do nothing trying to sell a missing item', async () => {
    const portfolio = fakeFileStorage({lastUpdate: 'xxx', companies: []});
    const history = fakeFileStorage([]);
    await portfolioOperations({
      ...defaultContext(),
      portfolioStorage: filePortfolioStorage(portfolio),
      historyStorage: fileHistoryStorage(history)
    }).sell('MISS', 100);
    expect(portfolio.data?.companies).toEqual([]);
    expect(history.data).toEqual([]);
  });

  it('should remove an existing item when selling', async () => {
    const portfolio = fakeFileStorage({
      lastUpdate: 'xxx', companies: [
        makeEmptyCompany({ticker: 'ABC', name: 'ABC Inc'}) as PortfolioCompany,
        makeEmptyCompany({
          ticker: 'RM',
          name: 'RM Inc',
          sharesQty: 42
        } as CoreCompany) as PortfolioCompany,
        makeEmptyCompany({
          ticker: 'BANG',
          name: 'Bang Inc'
        }) as PortfolioCompany,
      ]
    });
    const history = fakeFileStorage([]);

    const expected = [portfolio.data?.companies[0], portfolio.data?.companies[2]];

    await portfolioOperations({
      ...defaultContext(),
      portfolioStorage: filePortfolioStorage(portfolio),
      historyStorage: fileHistoryStorage(history)
    }).sell('RM', 100);

    expect(portfolio.data?.companies).toEqual(expected);
    expect(history.data).toEqual([
      expect.objectContaining({
        date: expect.any(String),
        name: 'RM Inc',
        price: 100,
        qty: 42,
        ticker: 'RM',
        type: 'SELL'
      })
    ]);
  });

  it('should add shares to existing qty when buying', async () => {
    const portfolio = fakeFileStorage({
      lastUpdate: 'xxx', companies: [
        makeEmptyCompany({
          ticker: 'ABC',
          name: 'ABC Inc',
          sharesQty: 1
        } as CoreCompany) as PortfolioCompany,
        makeEmptyCompany({
          ticker: 'BANG',
          name: 'Bang Inc',
          sharesQty: 42
        } as CoreCompany) as PortfolioCompany,
      ]
    });
    const history = fakeFileStorage([]);

    await portfolioOperations({
      ...defaultContext(),
      portfolioStorage: filePortfolioStorage(portfolio),
      historyStorage: fileHistoryStorage(history)
    }).buy('BANG', 100, 500);

    expect(portfolio.data?.companies).toEqual([
      expect.objectContaining({ticker: 'ABC', name: 'ABC Inc', sharesQty: 1}),
      expect.objectContaining({
        ticker: 'BANG',
        name: 'Bang Inc',
        sharesQty: 142
      })
    ]);

    expect(history.data).toEqual([
      expect.objectContaining({
        date: expect.any(String),
        name: 'Bang Inc',
        price: 500,
        qty: 100,
        ticker: 'BANG',
        type: 'BUY'
      })
    ]);
  });

  it('should add new portfolio entry when buying a new company', async () => {
    const portfolio = fakeFileStorage({
      lastUpdate: 'xxx', companies: [
        makeEmptyCompany({
          ticker: 'ABC',
          name: 'ABC Inc',
          sharesQty: 1
        } as CoreCompany) as PortfolioCompany
      ]
    });
    const history = fakeFileStorage([]);

    const mockAgent = new MockAgent({connections: 1});
    const mockClient = mockAgent.get(BASE_YAHOO_URL);
    setGlobalDispatcher(mockAgent);

    mockClient.intercept({
      path: /finance\/quoteSummary/,
      method: 'GET',
    }).reply(200, dummyQuoteSummary('BANG'));
    mockClient.intercept({
      path: /finance\/insights/,
      method: 'GET',
    }).reply(200, dummyInsight('BANG'));

    await portfolioOperations({
      ...defaultContext(),
      portfolioStorage: filePortfolioStorage(portfolio),
      historyStorage: fileHistoryStorage(history)
    }).buy('BANG', 100, 500);

    expect(portfolio.data?.companies).toEqual([
      expect.objectContaining({ticker: 'ABC', name: 'ABC Inc', sharesQty: 1}),
      expect.objectContaining({
        ticker: 'BANG',
        name: 'BANG Name',
        sharesQty: 100
      })
    ]);

    expect(history.data).toEqual([
      expect.objectContaining({
        date: expect.any(String),
        name: 'BANG Name',
        price: 500,
        qty: 100,
        ticker: 'BANG',
        type: 'BUY'
      })
    ]);
  });
});