import {CoreCompany} from '../../common/types/companies.types';
import {StateComparison} from '../utils/compareState';

export type ChangelogEntry = {
  id: string;
  date: string;
  added: CoreCompany[];
  removed: CoreCompany[];
}

export type ChangelogData = ChangelogEntry[];

export interface ChangelogStorage {
  findAll(): Promise<ChangelogData>;

  save(change: StateComparison): Promise<ChangelogEntry>;

  delete(id: ChangelogEntry['id']): Promise<void>;

  // TODO: clear(upTo?: Date): Promise<void>;
}

