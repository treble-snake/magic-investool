import {FileStorage} from '../storage/file';
import {HistoryRecord} from './history';
import path from 'path';
import {STORAGE_DIR} from '../common/config';

type HistoryStorage = HistoryRecord[];

// TODO: bad singleton, bad!
const STORAGE_FILE = path.join(STORAGE_DIR, 'history.json');
const storage = new FileStorage<HistoryStorage>(STORAGE_FILE);

export const readHistory = async () => {
  return storage.read();
}

export const writeHistory = async (history: HistoryStorage) => {
  return storage.write(history);
}

export const addRecord = async (record: HistoryRecord) => {
  const history = storage.readSync() || [];
  history.push(record);
  return storage.write(history);
}