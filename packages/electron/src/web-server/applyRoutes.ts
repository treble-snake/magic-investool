import express, {Request, Response} from 'express';
import {RouteMapNode} from './prepareRoutes';
import {EventEmitter} from 'node:events';
import {ApiEvent} from './types';

const getHandler = async (
  file: string,
  apiEvents: EventEmitter,
) => {
  const handle = (await import(file)).default;
  // Next.js adapter
  return (req: Request, res: Response) => {
    const {query, url, path, params, body, method} = req;
    apiEvents.emit('request', {
      query,
      url,
      path,
      params,
      body,
      method
    } as ApiEvent);
    // Next.js adaptation
    req.query = {...req.query, ...req.params};
    return handle(req, res);
  };
};

const isNode = (obj: RouteMapNode | string | undefined): obj is RouteMapNode => {
  return Boolean(obj) && typeof obj !== 'string';
};

export const applyRoutes = (
  routes: RouteMapNode,
  server: express.Express,
  apiEvents: EventEmitter
) => {
  const applyRoute = async (node: RouteMapNode, path: string = '/'): Promise<any> => {
    const {__handler, ...children} = node;
    if (node.__handler) {
      server.all(path, await getHandler(node.__handler, apiEvents));
    }

    // making sure dynamic routes applied last
    const pathNames = Object.keys(children).sort().reverse();
    return Promise.all(pathNames.map(async (key) => {
        const childNode = node[key];
        if (isNode(childNode)) {
          return applyRoute(childNode, `${path}${key}/`);
        }
      })
    );
  };

  return applyRoute(routes);
};

