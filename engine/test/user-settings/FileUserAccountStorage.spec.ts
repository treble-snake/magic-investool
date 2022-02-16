import {fakeFileStorage} from '../utils/fakeFileStorage';
import {
  fileUserAccountStorage, InternalAccountData
} from '../../src/user-settings/FileUserAccountStorage';

const fakeData = () => ({
  yahooApiKeys: [{value: 'key1', lastFailedAt: 123}, {value: 'key2'}],
  magicFormulaLogin: 'magicFormulaLogin',
  yahooCacheThreshold: 777,
  magicFormulaPassword: 'magicFormulaPassword',
  priceNotificationsEnabled: false,
  priceSchedulerIntervalMin: 60,
  priceSchedulerEnabled: false
} as InternalAccountData);

describe('FileUserAccountStorage', () => {
  it('should return account data', async () => {
    const storage = fileUserAccountStorage(fakeFileStorage(fakeData()));

    expect(await storage.getAccountData()).toEqual({
      ...fakeData(),
      yahooApiKeys: ['key1', 'key2'],
    });
  });

  it('should make changes with simple partial data', async () => {
    const storage = fileUserAccountStorage(fakeFileStorage(fakeData()));
    await storage.patchAccountData({
      magicFormulaLogin: 'newLogin',
      yahooCacheThreshold: 1000
    });
    expect(await storage.getAccountData()).toEqual({
      ...fakeData(),
      yahooApiKeys: ['key1', 'key2'],
      magicFormulaLogin: 'newLogin',
      yahooCacheThreshold: 1000,
    });
  });

  it('should change API keys', async () => {
    const storage = fileUserAccountStorage(fakeFileStorage(fakeData()));
    await storage.patchAccountData({
      yahooApiKeys: ['key3', 'key4']
    });
    expect(await storage.getAccountData()).toEqual({
      ...fakeData(),
      yahooApiKeys: ['key3', 'key4'],
    });
  });

  it('should save the order of the existing keys', async () => {
    const storage = fileUserAccountStorage(fakeFileStorage(fakeData()));

    await storage.patchAccountData({
      yahooApiKeys: ['key1', 'key3',  'key2']
    });
    expect(await storage.getAccountData()).toEqual({
      ...fakeData(),
      yahooApiKeys: ['key3', 'key1', 'key2'],
    });

    expect(await storage.getYahooKeys()).toEqual(['key3', 'key2', 'key1']);
  });
});