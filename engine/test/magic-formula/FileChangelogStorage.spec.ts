import {fileChangelogStorage} from '../../src/magic-formula/changelog/FileChangelogStorage';
import {format} from 'date-fns';
import {fakeFileStorage} from '../utils/fakeFileStorage';
import {ChangelogData} from '../../src/magic-formula/changelog/ChangelogStorage.types';

describe('FileChangelogStorage', () => {
  it('should save a changelog entry', async () => {
    const fake = fakeFileStorage<ChangelogData>([]);
    const storage = fileChangelogStorage(fake);
    await storage.save({
      added: [{ticker: 'ADD', name: 'ADD Inc'}],
      removed: [{ticker: 'REM', name: 'REM Inc'}],
      combined: []
    });

    expect(fake.data).toEqual([
      {
        id: expect.any(String),
        date: expect.stringContaining(format(Date.now(), 'yyyy-MM-dd')),
        added: [{ticker: 'ADD', name: 'ADD Inc'}],
        removed: [{ticker: 'REM', name: 'REM Inc'}],
      }
    ]);
  });

  it('should return empty array on uninitialized store', async () => {
    const fake = fakeFileStorage<ChangelogData>(null);
    const storage = fileChangelogStorage(fake);

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
    const fake = fakeFileStorage<ChangelogData>(entries);
    const storage = fileChangelogStorage(fake);

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
    const fake = fakeFileStorage<ChangelogData>(entries);
    const storage = fileChangelogStorage(fake);
    await storage.delete(entries[0].id)

    expect(fake.data).toEqual(entries.slice(1, 2));
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
    const fake = fakeFileStorage<ChangelogData>(entries);
    const storage = fileChangelogStorage(fake);
    await storage.delete('non-existing-id')

    expect(fake.data).toEqual(entries);
  });
});