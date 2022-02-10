import {fakeFileStorage} from '../utils/fakeFileStorage';
import {
  filePortfolioStorage
} from '../../src/portfoio/storage/FilePortfolioStorage';
import {PortfolioCompany} from '../../src';

describe('FilePortfolioStorage', () => {
  const COMPANY_DATA = {
    ticker: 'BANG',
    price: 80,
    breakEvenPrice: 100
  } as PortfolioCompany;
  const makeStorage = () => filePortfolioStorage(fakeFileStorage({
    lastUpdate: '',
    companies: [COMPANY_DATA]
  }));

  it('should do nothing if ticker doesnt exist', async () => {
    const storage = makeStorage();
    await storage.setPriceAlert('TEST', 100);
    expect(await storage.findByTicker('BANG')).toEqual(COMPANY_DATA);
  });

  it('should set price alert', async () => {
    const storage = makeStorage();
    await storage.setPriceAlert('BANG', 100);
    expect(await storage.findByTicker('BANG')).toEqual({
      ...COMPANY_DATA,
      priceAlert: {price: 100}
    });
  });

  it('should remove price alert', async () => {
    const storage = makeStorage();
    await storage.setPriceAlert('BANG', 100);
    await storage.removePriceAlert('BANG');
    expect(await storage.findByTicker('BANG')).toEqual({
      ...COMPANY_DATA,
    });
  });
});