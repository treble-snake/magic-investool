import {fakeFileStorage} from '../utils/fakeFileStorage';
import {fileUserSettingsStorage} from '../../src/user-settings/FileUserSettingsStorage';

describe('UserSettingsStorage', () => {
  it('should hide tickers and return the list', async () => {
    const storage = fileUserSettingsStorage(fakeFileStorage({hiddenTickers: []}));
    await storage.hideTicker('GOOG');
    await storage.hideTicker('AAPL');

    expect(await storage.getHiddenTickers()).toEqual(['GOOG', 'AAPL']);
  });

  it('should show tickers back', async () => {
    const storage = fileUserSettingsStorage(fakeFileStorage({
      hiddenTickers: ['GOOG', 'TSLA', 'AAPL']
    }));
    await storage.showTicker('TSLA');

    expect(await storage.getHiddenTickers()).toEqual(['GOOG', 'AAPL']);
  });

  it('should clear all hidden records', async () => {
    const storage = fileUserSettingsStorage(fakeFileStorage({
      hiddenTickers: ['GOOG', 'TSLA', 'AAPL']
    }));
    await storage.clearHiddenTickers();

    expect(await storage.getHiddenTickers()).toEqual([]);
  });

  it('should not find not hidden ticker', async () => {
    const storage = fileUserSettingsStorage(fakeFileStorage({
      hiddenTickers: ['GOOG', 'AAPL']
    }));

    expect(await storage.isHidden('TSLA')).toEqual(false);
  });

  it('should find hidden ticker', async () => {
    const storage = fileUserSettingsStorage(fakeFileStorage({
      hiddenTickers: ['GOOG', 'AAPL']
    }));

    expect(await storage.isHidden('GOOG')).toEqual(true);
  });
});