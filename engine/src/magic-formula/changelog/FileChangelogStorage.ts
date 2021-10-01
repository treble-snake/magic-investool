import {
  ChangelogData,
  ChangelogEntry,
  ChangelogStorage
} from './ChangelogStorage.types';
import {StateComparison} from '../utils/compareState';
import {pick} from 'ramda';
import {FileStorage, makeFileStorage} from '../../storage/file';

const STORAGE_FILENAME = 'mfChangelog.json';

export const fileChangelogStorage = (
  storage: FileStorage<ChangelogData> = makeFileStorage(STORAGE_FILENAME)
): ChangelogStorage => {
  return {
    async findAll() {
      return await storage.read() ?? [];
    },
    async save(change: StateComparison) {
      const current = await this.findAll();
      const now = new Date();
      const entry: ChangelogEntry = {
        id: now.getTime().toString(),
        date: now.toISOString(),
        added: change.added.map(pick(['name', 'ticker'])),
        removed: change.removed.map(pick(['name', 'ticker'])),
      };

      await storage.write(current.concat(entry));
      return entry;
    },
    async delete(id: ChangelogEntry['id']) {
      const current = await this.findAll();
      const modified = current.filter(it => it.id !== id);
      if (current.length !== modified.length) {
        await storage.write(modified);
      }
    }
  };
};
