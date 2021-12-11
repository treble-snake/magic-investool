import express from 'express';
import {prepareRoutes} from './prepareRoutes';
import * as path from 'path';
import {applyRoutes} from './applyRoutes';
import {app} from 'electron';
import {existsSync, mkdirSync} from 'fs';
import cors from 'cors';

export const startServer = async (origin: string) => {
  console.log('Starting Next.js server process');
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

  const server = express();
  server.use(express.json());
  server.use(cors({origin}));

  await applyRoutes(await prepareRoutes(path.resolve(__dirname, 'routes')), server);

  server.use(async (req, res, next) => {
    console.warn('Got unhandled request on:', req.url);
    res.status(404).send(`Handler not found for ${req.url}`);
  });

  const listener = server.listen(0, () => {
    console.log(`HTTP server is ready`);
  });

  const address = listener.address() || 'NOT FOUND';
  const port = typeof address !== 'string' ? address.port : address;
  console.log('Running on port ' + port);
  return port;
};
