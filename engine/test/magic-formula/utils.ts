import {ChangelogData} from '../../src/magic-formula/changelog/FileChangelogStorage';
import {fakeFileStorage} from '../utils/fakeFileStorage';

export const makeStorage = (init?: Partial<ChangelogData>) => {
  return fakeFileStorage({
    prevLastSeen: 0, lastSeen: 0, entries: [], ...init
  });
};