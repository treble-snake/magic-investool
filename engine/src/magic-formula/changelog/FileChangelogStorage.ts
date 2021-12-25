import {ChangelogEntry, ChangelogStorage} from './ChangelogStorage.types';
import {StateComparison} from '../utils/compareState';
import {pick} from 'ramda';
import {FileStorage, makeFileStorage} from '../../storage/file';

const STORAGE_FILENAME = 'mfChangelog.json';

export type ChangelogData = {
  prevLastSeen: number,
  lastSeen: number,
  entries: ChangelogEntry[]
};

export const fileChangelogStorage = (
  storage: FileStorage<ChangelogData> = makeFileStorage(STORAGE_FILENAME)
): ChangelogStorage => {

  async function saveData(update: Partial<ChangelogData>) {
    const data = await storage.read();
    await storage.write({
      prevLastSeen: data?.prevLastSeen || 0,
      lastSeen: data?.lastSeen || 0,
      entries: data?.entries || [],
      ...update
    });
  }

  return {
    async findAll() {
      const data = await storage.read();
      return data?.entries ?? [];
    },
    async save(entries: ChangelogEntry[]): Promise<void> {
      const data = await storage.read();
      return storage.write({
        lastSeen: 0,
        prevLastSeen: 0,
        ...data,
        entries
      });
    },
    async add(change: StateComparison) {
      const current = await this.findAll();
      const now = new Date();
      const entry: ChangelogEntry = {
        id: now.getTime().toString(),
        date: now.toISOString(),
        added: change.added.map(pick(['name', 'ticker'])),
        removed: change.removed.map(pick(['name', 'ticker'])),
      };

      await saveData({entries: current.concat(entry)});
      return entry;
    },
    async delete(id: ChangelogEntry['id']) {
      const current = await this.findAll();
      const modified = current.filter(it => it.id !== id);
      if (current.length !== modified.length) {
        await saveData({entries: modified});
      }
    },
    async lastSeenAt() {
      const data = await storage.read();
      return {
        prev: new Date(data?.prevLastSeen || 0),
        current: new Date(data?.lastSeen || 0)
      };
    },
    async setLastSeen(date: Date, thresholdSec = 0) {
      const {current} = await this.lastSeenAt();
      if (current.getTime() + thresholdSec * 1000 > date.getTime()) {
        return;
      }

      await saveData({
        prevLastSeen: current.getTime(),
        lastSeen: date.getTime()
      });
    }
  };
};
