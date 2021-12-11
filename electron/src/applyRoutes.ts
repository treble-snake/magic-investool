import express, {Request, Response} from 'express';
import {RouteMapNode} from './prepareRoutes';

const getHandler = async (file: string) => {
  const handle = (await import(file)).default;
  // Next.js adapter
  return (req: Request, res: Response) => {
    // req.method
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
  handlerBuilder = getHandler
) => {
  const applyRoute = async (node: RouteMapNode, path: string = '/'): Promise<any> => {
    const {__handler, ...children} = node;
    if (node.__handler) {
      server.all(path, await getHandler(node.__handler));
      // console.warn(`Handler for |${path}| applied`);
    }

    // making sure dynamic routes applied last
    const pathNames = Object.keys(children).sort().reverse();
    return Promise.all(pathNames.map(async (key) => {
        // console.warn('Processing ' + `${path}${key}`);
        const childNode = node[key];
        if (isNode(childNode)) {
          return applyRoute(childNode, `${path}${key}/`);
        }
      })
    );
  };

  return applyRoute(routes);
};

