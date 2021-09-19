import {portfolioOperations} from '../../src/portfoio/operations';
import {
  CoreCompany,
  PortfolioCompany
} from '../../src/common/types/companies.types';
import {FileStorage} from '../../src/storage/file';
import {filePortfolioStorage} from '../../src/portfoio/storage/FilePortfolioStorage';
import {makeEmptyCompany} from '../../src/enrichment/makeEmptyCompany';
import {fileHistoryStorage} from '../../src/portfoio/storage/FileHistoryStorage';

type FakeFileStorage<T> = FileStorage<T> & { data: T; };

const fakeStorage = <T>(init: T): FakeFileStorage<T> => {
  return {
    data: init,
    async read() {
      return this.data;
    },
    async write(data: T) {
      this.data = data;
    }
  };
};

describe('portfolio operations', () => {
  it('should do nothing trying to sell a missing item', async () => {
    const portfolio = fakeStorage({lastUpdate: 'xxx', companies: []});
    const history = fakeStorage([]);
    await portfolioOperations({
      portfolioStorage: filePortfolioStorage(portfolio),
      historyStorage: fileHistoryStorage(history)
    }).sell('MISS', 100);
    expect(portfolio.data.companies).toEqual([]);
    expect(history.data).toEqual([]);
  });

  it('should remove an existing item when selling', async () => {
    const portfolio = fakeStorage({
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
    const history = fakeStorage([]);

    const expected = [portfolio.data.companies[0], portfolio.data.companies[2]];

    await portfolioOperations({
      portfolioStorage: filePortfolioStorage(portfolio),
      historyStorage: fileHistoryStorage(history)
    }).sell('RM', 100);

    expect(portfolio.data.companies).toEqual(expected);
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
});