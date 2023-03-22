import {FileStorage, makeFileStorage} from '../storage/file';
import {AccountData, UserAccountStorage} from './UserAccountStorage.types';

const USER_SETTINGS_FILENAME = 'userAccount.json';

const DEFAULTS: AccountData = Object.freeze({
  alphavantageApiKey: '',
  finnhubApiKey: '',
  magicFormulaLogin: '',
  magicFormulaPassword: '',
  priceSchedulerEnabled: false,
  priceSchedulerIntervalMin: 5,
  priceNotificationsEnabled: false,
  stockUpdatesEnabled: true,
  stockUpdatesIntervalMin: 15
});

export const fileUserAccountStorage = (
  storage: FileStorage<AccountData> = makeFileStorage(USER_SETTINGS_FILENAME)
): UserAccountStorage => {
  let cached: AccountData | null = null;

  const fetchData = async () => {
    if (cached) {
      return {...cached};
    }

    const data = await storage.read();
    const result = {
      ...DEFAULTS,
      ...(data || {})
    };
    cached = {...result};
    return result;
  };

  const writeData = async (data: AccountData) => {
    await storage.write(data);
    cached = {...data};
    return data;
  };

  return {
    async getAccountData() {
      return fetchData();
    },
    async patchAccountData(input: Partial<AccountData>) {
      const current = await fetchData();
      const result: AccountData = {
        ...current,
        ...input
      };
      return writeData(result);
    }
  };
};
