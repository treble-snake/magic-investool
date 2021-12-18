import {
  ChangelogData,
  fileChangelogStorage
} from '../../src/magic-formula/changelog/FileChangelogStorage';
import {format} from 'date-fns';
import {fakeFileStorage} from '../utils/fakeFileStorage';
import {makeStorage} from './utils';

describe('FileChangelogStorage', () => {
  it('should save a changelog entry', async () => {
    const storage = fileChangelogStorage(makeStorage());
    await storage.save({
      added: [{ticker: 'ADD', name: 'ADD Inc'}],
      removed: [{ticker: 'REM', name: 'REM Inc'}],
      combined: []
    });

    expect(await storage.findAll()).toEqual([
      {
        id: expect.any(String),
        date: expect.stringContaining(new Date().toISOString().split('T')[0]),
        added: [{ticker: 'ADD', name: 'ADD Inc'}],
        removed: [{ticker: 'REM', name: 'REM Inc'}],
      }
    ]);
  });

  it('should return empty array on uninitialized store', async () => {
    const storage = fileChangelogStorage(fakeFileStorage<ChangelogData>(null));
    expect(await storage.findAll()).toEqual([]);
  });

  it('should find all entries', async () => {
    const entries = [{
      id: '12346',
      date: '2021-01-01',
      added: [{ticker: 'ADD1', name: 'ADD1 Inc'}],
      removed: [{ticker: 'REM1', name: 'REM1 Inc'}],
    }, {
      id: '67890',
      date: '2020-02-02',
      added: [{ticker: 'ADD2', name: 'ADD2 Inc'}],
      removed: [{ticker: 'REM2', name: 'REM2 Inc'}],
    }];
    const storage = fileChangelogStorage(makeStorage({entries}));

    expect(await storage.findAll()).toEqual(entries);
  });

  it('should delete an entry', async () => {
    const entries = [{
      id: '12346',
      date: '2021-01-01',
      added: [{ticker: 'ADD1', name: 'ADD1 Inc'}],
      removed: [{ticker: 'REM1', name: 'REM1 Inc'}],
    }, {
      id: '67890',
      date: '2020-02-02',
      added: [{ticker: 'ADD2', name: 'ADD2 Inc'}],
      removed: [{ticker: 'REM2', name: 'REM2 Inc'}],
    }];
    const storage = fileChangelogStorage(makeStorage({entries}));
    await storage.delete(entries[0].id);

    expect(await storage.findAll()).toEqual(entries.slice(1, 2));
  });

  it('should do nothing on non-existing entry removal', async () => {
    const entries = [{
      id: '12346',
      date: '2021-01-01',
      added: [{ticker: 'ADD1', name: 'ADD1 Inc'}],
      removed: [{ticker: 'REM1', name: 'REM1 Inc'}],
    }, {
      id: '67890',
      date: '2020-02-02',
      added: [{ticker: 'ADD2', name: 'ADD2 Inc'}],
      removed: [{ticker: 'REM2', name: 'REM2 Inc'}],
    }];

    const storage = fileChangelogStorage(makeStorage({entries}));
    await storage.delete('non-existing-id');

    expect(await storage.findAll()).toEqual(entries);
  });

  it('should return unix epoch start if no lastSeen data available', async () => {
    const storage = fileChangelogStorage(fakeFileStorage<ChangelogData>(null));
    const {current} = await storage.lastSeenAt();
    expect(current.toISOString()).toEqual(expect.stringContaining('1970-01-01'));
  });
});