import {portfolioOperations} from '../../src/portfoio/portfolioOperations';
import {
  CoreCompany,
  PortfolioCompany
} from '../../src/common/types/companies.types';
import {
  filePortfolioStorage,
  PortfolioData
} from '../../src/portfoio/storage/FilePortfolioStorage';
import {completeCompanyData} from '../../src/enrichment/completeCompanyData';
import {
  fileHistoryStorage
} from '../../src/portfoio/storage/FileHistoryStorage';
import {fakeFileStorage} from '../utils/fakeFileStorage';
import {fakeContext} from '../utils/fakeContext';
import {FileStorage} from '../../src/storage/file';
import {HistoryRecord} from '../../src/portfoio/storage/HistoryStorage.types';
import {mockApis} from '../utils/api-mocks/mockApis';
import {DUMMY_PRICE} from '../data-source/finnhub/dummyPriceQuote';

function getOperations(
  portfolio: FileStorage<PortfolioData>,
  history: FileStorage<HistoryRecord[]>) {
  return portfolioOperations({
    ...fakeContext(),
    portfolioStorage: filePortfolioStorage(portfolio),
    historyStorage: fileHistoryStorage(history)
  });
}


describe('portfolio operations', () => {

  describe('sell', () => {
    it('should do nothing trying to sell a missing item', async () => {
      const portfolio = fakeFileStorage({lastUpdate: 'xxx', companies: []});
      const history = fakeFileStorage([]);
      await portfolioOperations({
        ...fakeContext(),
        portfolioStorage: filePortfolioStorage(portfolio),
        historyStorage: fileHistoryStorage(history)
      }).sell('MISS', 100);
      expect(portfolio.data?.companies).toEqual([]);
      expect(history.data).toEqual([]);
    });

    it('should remove an existing item when selling', async () => {
      const portfolio = fakeFileStorage({
        lastUpdate: 'xxx', companies: [
          completeCompanyData({
            ticker: 'ABC',
            name: 'ABC Inc'
          }) as PortfolioCompany,
          completeCompanyData({
            ticker: 'RM',
            name: 'RM Inc',
            sharesQty: 42
          } as CoreCompany) as PortfolioCompany,
          completeCompanyData({
            ticker: 'BANG',
            name: 'Bang Inc'
          }) as PortfolioCompany,
        ]
      });
      const history = fakeFileStorage([]);

      const expected = [portfolio.data?.companies[0], portfolio.data?.companies[2]];

      await portfolioOperations({
        ...fakeContext(),
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
  });

  describe('buy', () => {
    it('should add new portfolio entry when buying a new company', async () => {
      const portfolio = fakeFileStorage({
        lastUpdate: 'xxx', companies: [
          completeCompanyData({
            ticker: 'ABC',
            name: 'ABC Inc',
            sharesQty: 1
          } as CoreCompany) as PortfolioCompany
        ]
      });
      const history = fakeFileStorage([]);
      mockApis('BANG');

      await portfolioOperations({
        ...fakeContext(),
        portfolioStorage: filePortfolioStorage(portfolio),
        historyStorage: fileHistoryStorage(history)
      }).buy('BANG', 100, 500);

      expect(portfolio.data?.companies).toEqual([
        expect.objectContaining({ticker: 'ABC', name: 'ABC Inc', sharesQty: 1}),
        expect.objectContaining({
          ticker: 'BANG',
          name: 'BANG Name',
          sharesQty: 100,
          breakEvenPrice: 500
        } as PortfolioCompany)
      ]);

      expect(history.data).toEqual([
        expect.objectContaining({
          date: expect.any(String),
          name: 'BANG Name',
          price: 500,
          qty: 100,
          ticker: 'BANG',
          type: 'BUY',
        })
      ]);
    });

    it('should add shares to existing qty when buying', async () => {
      const portfolio = fakeFileStorage({
        lastUpdate: 'xxx', companies: [
          completeCompanyData({
            ticker: 'ABC',
            name: 'ABC Inc',
            sharesQty: 1
          } as CoreCompany) as PortfolioCompany,
          completeCompanyData({
            ticker: 'BANG',
            name: 'Bang Inc',
            sharesQty: 42,
          } as CoreCompany) as PortfolioCompany,
        ]
      });
      const history = fakeFileStorage([]);

      await portfolioOperations({
        ...fakeContext(),
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

    it('should update purchase date time for the existing item when buying', async () => {
      const portfolio = fakeFileStorage({
        lastUpdate: 'xxx', companies: [
          completeCompanyData({
            ticker: 'BANG',
            name: 'Bang Inc',
            purchaseDate: '2020-01-01',
            sharesQty: 42
          } as PortfolioCompany) as PortfolioCompany,
        ]
      });
      const history = fakeFileStorage([]);

      await portfolioOperations({
        ...fakeContext(),
        portfolioStorage: filePortfolioStorage(portfolio),
        historyStorage: fileHistoryStorage(history)
      }).buy('BANG', 100, 500, new Date('2021-02-02'));

      expect(portfolio.data?.companies).toEqual([
        expect.objectContaining({
          ticker: 'BANG',
          name: 'Bang Inc',
          sharesQty: 142,
          purchaseDate: new Date('2021-02-02').toISOString()
        } as PortfolioCompany)
      ]);
    });

    it('should recalculate BEP for existing item when buying', async () => {
      const portfolio = fakeFileStorage({
        lastUpdate: 'xxx', companies: [
          completeCompanyData({
            ticker: 'BANG',
            name: 'Bang Inc',
            sharesQty: 42,
          } as CoreCompany) as PortfolioCompany,
        ]
      });
      const history = fakeFileStorage([{
        date: '2020-01-01',
        name: 'Bang Inc',
        price: 100,
        qty: 100,
        ticker: 'BANG',
        type: 'BUY'
      }] as HistoryRecord[]);

      await getOperations(portfolio, history).buy('BANG', 100, 50);

      expect(portfolio.data?.companies).toEqual([
        expect.objectContaining({
          ticker: 'BANG',
          name: 'Bang Inc',
          sharesQty: 142,
          breakEvenPrice: 75
        } as PortfolioCompany)
      ]);
    });
  });

  describe('checkPrices', function () {
    function prepareContext(alertPrevPrice = 10) {
      mockApis('ALERT', 'NO_ALERT');
      const portfolio = fakeFileStorage({
        lastUpdate: 'xxx', companies: [
          completeCompanyData({
            ticker: 'ALERT',
            price: alertPrevPrice,
            priceAlert: {price: 20}
          }),
          completeCompanyData({ticker: 'NO_ALERT', price: 100}),
        ] as PortfolioCompany[]
      });

      return {
        ...fakeContext(),
        portfolioStorage: filePortfolioStorage(portfolio),
      };
    }

    it('should update only alerted companies', async () => {
      const context = prepareContext();
      await portfolioOperations(context).checkPrices();

      const alert = await context.portfolioStorage.findByTicker('ALERT');
      const noAlert = await context.portfolioStorage.findByTicker('NO_ALERT')

      expect(alert?.price).toEqual(DUMMY_PRICE);
      expect(noAlert?.price).toEqual(100);
    });

    it('should return tickers for triggered alerts', async () => {
      const triggered = await portfolioOperations(prepareContext()).checkPrices();
      expect(triggered).toEqual(['ALERT']);
    });

    it('should not trigger alerts if the price is already higher', async () => {
      const triggered = await portfolioOperations(prepareContext(50)).checkPrices();
      expect(triggered).toEqual([]);
    });
  });
});