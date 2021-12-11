import {FileStorage, makeFileStorage} from '../../storage/file';
import {HistoryRecord, HistoryStorage} from './HistoryStorage.types';
import {nanoid} from 'nanoid';

const HISTORY_FILENAME = 'history.json';

export const fileHistoryStorage = (
  fileStorage: FileStorage<HistoryRecord[]> = makeFileStorage(HISTORY_FILENAME)
): HistoryStorage => {
  return {
    async findAll() {
      const data = await fileStorage.read();
      return data ?? [];
    },
    async findByTicker(ticker: string) {
      const data = await this.findAll();
      return data.filter(it => it.ticker === ticker);
    },
    async addRecord(record: HistoryRecord) {
      const data = await this.findAll();
      data.push({
        ...record,
        id: nanoid()
      });
      return fileStorage.write(data);
    },
    async deleteRecord(id: string) {
      const items = await this.findAll();
      return fileStorage.write(items.filter(it => it.id !== id));
    },
    async updateRecord(id: string, update: Partial<Omit<HistoryRecord, 'id'>>) {
      const items = await this.findAll();
      const found = items.find(it => it.id === id);
      if (!found) {
        return;
      }

      return fileStorage.write(items.filter(it => it.id !== id).concat({
        ...found,
        ...update
      }));
    }
  };
};
