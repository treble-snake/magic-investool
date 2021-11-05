import {FileStorage, makeFileStorage} from '../../storage/file';
import {HistoryRecord, HistoryStorage} from './HistoryStorage.types';

const HISTORY_FILENAME = 'history.json';

export const fileHistoryStorage = (
  fileStorage: FileStorage<HistoryRecord[]> = makeFileStorage(HISTORY_FILENAME)
): HistoryStorage => {
  return {
    async findAll() {
      const data = await fileStorage.read();
      return data ?? [];
    },
    save(records: HistoryRecord[]) {
      return fileStorage.write(records);
    },
    async addRecord(record: HistoryRecord) {
      const data = await this.findAll();
      data.push(record);
      return this.save(data);
    }
  };
};
