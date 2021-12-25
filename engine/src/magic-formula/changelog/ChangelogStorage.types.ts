import {CoreCompany} from '../../common/types/companies.types';
import {StateComparison} from '../utils/compareState';

export type ChangelogEntry = {
  id: string;
  date: string;
  added: CoreCompany[];
  removed: CoreCompany[];
}

export interface ChangelogStorage {
  findAll(): Promise<ChangelogEntry[]>;

  add(change: StateComparison): Promise<ChangelogEntry>;

  delete(id: ChangelogEntry['id']): Promise<void>;

  save(entries: ChangelogEntry[]): Promise<void>;

  lastSeenAt(): Promise<{prev: Date, current: Date}>;

  setLastSeen(date: Date, thresholdSec?: number): Promise<void>;
}

