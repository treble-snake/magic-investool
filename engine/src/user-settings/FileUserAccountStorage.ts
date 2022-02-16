import {FileStorage, makeFileStorage} from '../storage/file';
import {AccountData, UserAccountStorage} from './UserAccountStorage.types';
import {indexBy, prop} from 'ramda';

const USER_SETTINGS_FILENAME = 'userAccount.json';

type ApiKey = {
  value: string;
  lastFailedAt?: number;
  lastFailureReason?: string;
}

// I don't like this type mapping mess. Let's find better solution.
export type InternalAccountData = Omit<AccountData, 'yahooApiKeys'> & {
  yahooApiKeys: ApiKey[];
}

const DEFAULTS: InternalAccountData = Object.freeze({
  yahooApiKeys: [],
  magicFormulaLogin: '',
  magicFormulaPassword: '',
  yahooCacheThreshold: 24,
  priceSchedulerEnabled: false,
  priceSchedulerIntervalMin: 120,
  priceNotificationsEnabled: false
});

const compareApiKeys = (a: ApiKey, b: ApiKey) => {
  if (a.lastFailedAt === b.lastFailedAt) {
    return 0;
  }
  if (!a.lastFailedAt) {
    return -1;
  }
  if (!b.lastFailedAt) {
    return 1;
  }

  return b.lastFailedAt - a.lastFailedAt;
};

const makeExternalData = (data: InternalAccountData): AccountData => ({
  ...data,
  yahooApiKeys: data.yahooApiKeys.map(it => it.value),
});

const mergeKeys = (input: undefined | string[], current: ApiKey[]): ApiKey[] => {
  if (!input) {
    return current;
  }
  // preserve only keys present in the input
  const filteredCurrent = current.filter(it => input.includes(it.value));
  if (!filteredCurrent) {
    return input.map(value => ({value}));
  }
  // add only keys missing in the storage
  const indexedCurrent = indexBy(prop('value'), filteredCurrent);
  const newInput = input.filter(it => !indexedCurrent[it]);

  return newInput.map(value => ({value})).concat(filteredCurrent);
};

export const fileUserAccountStorage = (
  storage: FileStorage<InternalAccountData> = makeFileStorage(USER_SETTINGS_FILENAME)
): UserAccountStorage => {
  let cached: InternalAccountData | null = null;

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

  const writeData = async (data: InternalAccountData) => {
    await storage.write(data);
    cached = {...data};
    return data;
  };

  return {
    async getAccountData() {
      return makeExternalData(await fetchData());
    },
    async patchAccountData(input: Partial<AccountData>) {
      const current = await fetchData();
      const result: InternalAccountData = {
        ...current,
        ...input,
        yahooApiKeys: mergeKeys(input.yahooApiKeys, current.yahooApiKeys)
      };
      return makeExternalData(await writeData(result));
    },
    async getYahooKeys() {
      const data = await fetchData();
      return data.yahooApiKeys.sort(compareApiKeys).map(it => it.value);
    },
    async reportYahooKey(key: string, reason?: string): Promise<void> {
      const data = await fetchData();
      const currentKey = data.yahooApiKeys.find(it => it.value === key);
      if (!currentKey) {
        return;
      }

      await writeData({
        ...data,
        yahooApiKeys: data.yahooApiKeys.map(it => {
          if (it.value !== key) {
            return it;
          }
          return {
            ...it,
            lastFailedAt: Date.now(),
            lastFailureReason: reason
          };
        }),
      });
    }

  };
};
