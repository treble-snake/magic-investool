import {run} from '../utils/run';
import {makeFileStorage} from '../../storage/file';
import {HistoryRecord} from '../../portfoio/storage/HistoryStorage.types';
import {nanoid} from 'nanoid';

run(async () => {
  const storage = makeFileStorage<HistoryRecord[]>('history.json');
  const history = (await storage.read()) || [];
  await storage.write(history.map(it => ({
    ...it,
    id: nanoid(),
  })));
});