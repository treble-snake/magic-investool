import {fakeContext} from '../utils/fakeContext';
import {magicFormulaOperations} from '../../src';
import {
  ChangelogData,
  fileChangelogStorage
} from '../../src/magic-formula/changelog/FileChangelogStorage';
import {makeStorage} from './utils';

const entry = (id: string, date: number | string) => ({
  id, date: new Date(date).toISOString(), removed: [], added: []
});

describe('magic formula operations', () => {
  const makeOps = (init?: Partial<ChangelogData>) => {
    const fakeStorage = makeStorage(init);
    return {
      fakeStorage,
      ops: magicFormulaOperations(fakeContext({
        mfChangelogStorage: fileChangelogStorage(fakeStorage)
      }))
    };
  };

  describe('History changes', () => {
    it('should return empty result if there are no changes', async () => {
      const {ops} = makeOps();
      expect(await ops.getUnseenChanges()).toEqual([]);
    });

    it('should return empty result if all entries are seen', async () => {
      const {ops} = makeOps({
        lastSeen: Date.now(),
        entries: [entry('1', Date.now() - 999999)]
      });

      expect(await ops.getUnseenChanges()).toEqual([]);
    });

    it('should return entries added after lastSeen', async () => {
      const oldEntry = entry('1', Date.now() - 999999);
      const newEntry = entry('2', Date.now());
      const {ops} = makeOps({
        lastSeen: Date.now() - 555555,
        entries: [oldEntry, newEntry]
      });

      expect(await ops.getUnseenChanges()).toEqual([newEntry]);
    });


    it('should respect lastSeen threshold', async () => {
      const oldEntry = entry('2', Date.now() - 1000 * 1000);
      const newEntry = entry('3', Date.now() - 100 * 1000);
      const {ops} = makeOps({
        prevLastSeen: Date.now() - 150 * 1000,
        lastSeen: Date.now(),
        entries: [oldEntry, newEntry]
      });

      expect(await ops.getUnseenChanges(60)).toEqual([newEntry]);
    });

    describe('cleanup', () => {
      function generate5entries() {
        const entries = [];
        const date = Date.now();
        for (let i = 0; i < 5; i++) {
          entries.push(entry('id' + i, date + i * 1000));
        }
        return entries;
      }

      it('should remove everything on cleanup if the limit is 0', async () => {
        const {ops, fakeStorage} = makeOps({entries: generate5entries()});
        await ops.cleanup(0);
        expect(fakeStorage.data?.entries).toEqual([]);
      });

      it('should keep only N newest items on cleanup', async () => {
        const {ops, fakeStorage} = makeOps({entries: generate5entries()});
        await ops.cleanup(2);
        expect(fakeStorage.data?.entries).toEqual([
          // only the newest should remain
          expect.objectContaining({id: 'id3'}),
          expect.objectContaining({id: 'id4'}),
        ]);
      });

      it('should work if sort order is messed up in the storage', async () => {
        const sorted = generate5entries();
        const entries = [sorted[3], sorted[2], sorted[0], sorted[4], sorted[1]];

        const {ops, fakeStorage} = makeOps({entries});
        await ops.cleanup(2);
        expect(fakeStorage.data?.entries).toEqual([
          // only the newest should remain
          expect.objectContaining({id: 'id3'}),
          expect.objectContaining({id: 'id4'}),
        ]);
      });
    });
  });
});