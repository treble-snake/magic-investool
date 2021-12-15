import {FileStorage, makeFileStorage} from '../storage/file';
import {AccountData, UserAccountStorage} from './UserAccountStorage.types';

const USER_SETTINGS_FILENAME = 'userAccount.json';

const DEFAULTS: AccountData = Object.freeze({
  yahooApiKey: '',
  magicFormulaLogin: '',
  magicFormulaPassword: '',
  yahooCacheThreshold: 24
});

export const fileUserAccountStorage = (
  storage: FileStorage<AccountData> = makeFileStorage(USER_SETTINGS_FILENAME)
): UserAccountStorage => {
  let cached: AccountData | null = null;

  return {
    async getAccountData() {
      if (cached) {
        return cached;
      }

      const data = await storage.read();
      const result = {
        ...DEFAULTS,
        ...(data || {})
      };
      cached = result;
      return result;
    },
    async patchAccountData(data: Partial<AccountData>) {
      const current = await this.getAccountData();
      const result = {...current, ...data};
      await storage.write(result);
      cached = result;
      return result;
    },
  };
};
