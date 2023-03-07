import {fakeFileStorage} from '../utils/fakeFileStorage';
import {
  fileUserAccountStorage
} from '../../src/user-settings/FileUserAccountStorage';
import {FAKE_ACCOUNT_DATA} from '../utils/fakeContext';

const fakeData = () => FAKE_ACCOUNT_DATA;

describe('FileUserAccountStorage', () => {
  it('should return account data', async () => {
    const storage = fileUserAccountStorage(fakeFileStorage(fakeData()));

    expect(await storage.getAccountData()).toEqual({
      ...fakeData(),
    });
  });

  it('should make changes with simple partial data', async () => {
    const storage = fileUserAccountStorage(fakeFileStorage(fakeData()));
    await storage.patchAccountData({
      magicFormulaLogin: 'newLogin',
      priceSchedulerIntervalMin: 100,
    });
    expect(await storage.getAccountData()).toEqual({
      ...fakeData(),
      magicFormulaLogin: 'newLogin',
      priceSchedulerIntervalMin: 100,
    });
  });
});