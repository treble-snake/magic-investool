import {portfolioOperations} from '../../src/portfoio/operations';
import {PortfolioCompany} from '../../src/common/types/companies.types';
import {FileStorage} from '../../src/storage/file';
import {
  filePortfolioStorage,
  PortfolioData
} from '../../src/portfoio/storage/FilePortfolioStorage';
import {makeEmptyCompany} from '../../src/enrichment/makeEmptyCompany';

type TestFileStorage =
  FileStorage<PortfolioData>
  & { data: PortfolioCompany[]; };

const getTestStorage = (init: PortfolioCompany[]): TestFileStorage => {
  // @ts-ignore
  return {
    data: [...init],
    async read() {
      return {companies: [...this.data], lastUpdate: ''};
    },
    async write(data: PortfolioData) {
      this.data = [...data.companies];
    }
  };
};

describe('portfolio operations', () => {
  it('should do nothing trying to sell a missing item', async () => {
    const testStorage = getTestStorage([]);
    const newState = await portfolioOperations({
      portfolioStorage: filePortfolioStorage(testStorage),
    }).sell('MISS', 100);
    expect(newState).toEqual([]);
    expect(testStorage.data).toEqual([]);
  });

  it('should remove an existing item', async () => {
    const testStorage = getTestStorage([
      makeEmptyCompany({ticker: 'ABC', name: 'ABC Inc'}) as PortfolioCompany,
      makeEmptyCompany({ticker: 'RM', name: 'RM Inc'}) as PortfolioCompany,
      makeEmptyCompany({ticker: 'BANG', name: 'Bang Inc'}) as PortfolioCompany,
    ]);

    const expected = [testStorage.data[0], testStorage.data[2]];

    const newState = await portfolioOperations({
      portfolioStorage: filePortfolioStorage(testStorage),
    }).sell('RM', 100);
    expect(newState).toEqual(expected);
    expect(testStorage.data).toEqual(expected);
  });
});