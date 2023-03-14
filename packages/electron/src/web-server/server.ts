import express from 'express';
import {prepareRoutes} from './prepareRoutes';
import * as path from 'path';
import {applyRoutes} from './applyRoutes';
import cors from 'cors';
import {EventEmitter} from 'node:events';

export const startServer = async (origin: string, apiEvents: EventEmitter) => {
  console.log('Starting Next.js server process');

  const server = express();
  server.use(express.json());
  server.use(cors({origin}));

  await applyRoutes(
    await prepareRoutes(path.resolve(__dirname, '../routes')),
    server,
    apiEvents
  );

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
