import {FileStorage, makeFileStorage} from '../storage/file';
import {UserSettingsStorage} from './UserSettingsStorage.types';

type UserSettingsData = {
  hiddenTickers: string[];
}

const USER_SETTINGS_FILENAME = 'userSettings.json';

export const fileUserSettingsStorage = (
  storage: FileStorage<UserSettingsData> = makeFileStorage(USER_SETTINGS_FILENAME)
): UserSettingsStorage => {
  return {
    async getHiddenTickers() {
      const data = await storage.read();
      return data?.hiddenTickers || [];
    },
    clearHiddenTickers() {
      return storage.write({hiddenTickers: []});
    },
    async hideTicker(ticker: string) {
      const hidden = new Set(await this.getHiddenTickers());
      if (hidden.has(ticker)) {
        return;
      }

      return storage.write({hiddenTickers: Array.from(hidden.add(ticker))});
    },
    async showTicker(ticker: string) {
      const hidden = new Set(await this.getHiddenTickers());
      if (!hidden.delete(ticker)) {
        return;
      }

      return storage.write({hiddenTickers: Array.from(hidden)});
    },
    async isHidden(ticker: string) {
      const hidden = await this.getHiddenTickers();
      return hidden.includes(ticker);
    }
  };
};
