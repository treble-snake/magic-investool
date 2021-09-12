import {findOverdueItems} from '../../src/portfoio/findOverdueItems';
import {PortfolioCompany} from '../../src/common/companies';

describe('findOverdueItems', () => {
  it('should return empty result on empty input', () => {
    expect(findOverdueItems([])).toEqual([]);
  });

  it('should return empty if all items are not due yet', () => {
    expect(findOverdueItems([
        {ticker: 'AAPL', purchaseDate: '2020-02-02'},
        {ticker: 'GOOG', purchaseDate: '2020-04-04'},
      ] as PortfolioCompany[],
      new Date('2020-06-01')
    )).toEqual([]);
  });

  it('should find and sort items bought more than a year ago', () => {
    expect(findOverdueItems([
        {ticker: 'GOOG', purchaseDate: '2020-03-03'},
        {ticker: 'AMZN', purchaseDate: '2020-05-05'},
        {ticker: 'AAPL', purchaseDate: '2020-02-02'},
        {ticker: 'TESL', purchaseDate: '2020-04-04'},
      ] as PortfolioCompany[],
      new Date('2021-03-04')
    )).toEqual([
      {ticker: 'AAPL', purchaseDate: '2020-02-02'},
      {ticker: 'GOOG', purchaseDate: '2020-03-03'},
    ]);
  });

  it('should find items till the end of the months', () => {
    expect(findOverdueItems([
        {ticker: 'GOOG', purchaseDate: '2020-03-03'},
        {ticker: 'AMZN', purchaseDate: '2020-05-05'},
        {ticker: 'AAPL', purchaseDate: '2020-02-02'},
        {ticker: 'TESL', purchaseDate: '2020-04-04'},
      ] as PortfolioCompany[],
      new Date('2021-03-01')
    )).toEqual([
      {ticker: 'AAPL', purchaseDate: '2020-02-02'},
      {ticker: 'GOOG', purchaseDate: '2020-03-03'},
    ]);
  });
});