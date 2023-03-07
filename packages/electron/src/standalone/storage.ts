import path from 'path';
import {app} from 'electron';
import {existsSync, mkdirSync} from 'fs';
import {prepareStorage} from '@investool/engine/dist/cli/utils/prepareStorage';

export const ensureStorage = () => {
  console.debug(`Storage dir from environment:`, process.env.STORAGE_DIR);
  if (!process.env.STORAGE_DIR) {
    console.debug('No storage dir set via environment variables, use app default');
    const storageDir = path.join(app.getPath('userData'), 'investool-data');
    if (!existsSync(storageDir)) {
      console.log('Creating storage dir at ' + storageDir);
      mkdirSync(storageDir);
    }

    console.debug('Storage dir:', storageDir);
    process.env.STORAGE_DIR = storageDir;
  }

// Should be imported after process.env.STORAGE_DIR is set
// TODO: not ideal
  const {prepareStorage} = require('@investool/engine/dist/cli/utils/prepareStorage');
  prepareStorage();
}
