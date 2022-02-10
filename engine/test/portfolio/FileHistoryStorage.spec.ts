import {fakeFileStorage} from '../utils/fakeFileStorage';
import {fileHistoryStorage} from '../../src/portfoio/storage/FileHistoryStorage';
import {ActionType} from '../../src/portfoio/storage/HistoryStorage.types';

describe('FileHistoryStorage', () => {
  const TEST_RECORD = Object.freeze({
    type: ActionType.SELL,
    qty: 123,
    name: 'Abc Inc',
    price: 321,
    date: '2021-01-02',
    ticker: 'ABC'
  });

  it('should add a record', async () => {
    const storage = fileHistoryStorage(fakeFileStorage([]));
    await storage.addRecord(TEST_RECORD);

    expect(await storage.findAll()).toEqual([
      expect.objectContaining({id: expect.stringContaining(''), ...TEST_RECORD})
    ]);
  });

  it('should delete a record', async () => {
    const storage = fileHistoryStorage(fakeFileStorage([]));
    await storage.addRecord(TEST_RECORD);
    await storage.addRecord({...TEST_RECORD, type: ActionType.BUY});
    const items = await storage.findAll();
    await storage.deleteRecord(items[1].id);

    expect(await storage.findAll()).toEqual([
      expect.objectContaining(TEST_RECORD)
    ]);
  });

  it('should not delete a record if ID is non-existing', async () => {
    const storage = fileHistoryStorage(fakeFileStorage([]));
    await storage.addRecord(TEST_RECORD);
    await storage.deleteRecord('');

    expect(await storage.findAll()).toEqual([
      expect.objectContaining(TEST_RECORD)
    ]);
  });

  it('should edit a record by id', async () => {
    const storage = fileHistoryStorage(fakeFileStorage([]));
    await storage.addRecord(TEST_RECORD);
    await storage.addRecord({...TEST_RECORD, type: ActionType.BUY});
    const items = await storage.findAll();
    await storage.updateRecord(items[0].id, {
      qty: 666,
      price: 100500
    });

    expect(await storage.findAll()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        ...TEST_RECORD,
        qty: 666,
        price: 100500
      }),
      expect.objectContaining({...TEST_RECORD, type: ActionType.BUY}),
    ]));
  });

  it('should not edit anything with non-existing ID', async () => {
    const storage = fileHistoryStorage(fakeFileStorage([]));
    await storage.addRecord(TEST_RECORD);
    await storage.updateRecord('', {qty: 77777});

    expect(await storage.findAll()).toEqual([
      expect.objectContaining(TEST_RECORD)
    ]);
  });
});