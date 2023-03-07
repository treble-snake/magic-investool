import {readdir, stat} from 'fs/promises';
import {resolve} from 'path';

export type RouteMapNode = {
  __handler?: string;
  [key: string]: RouteMapNode | string | undefined
};

const getDynamicRouteName = (dir: string) =>
  ':' + dir.substring(0, dir.length - 4).substring(1);

const getStaticRouteName = (dir: string) =>
  dir.substring(0, dir.length - 3);

export const prepareRoutes = async (parentPath: string) => {
  const subDirs = await readdir(parentPath);

  const node: RouteMapNode = {};
  for (const childDir of subDirs) {
    const childPath = resolve(parentPath, childDir);

    const stats = await stat(childPath);
    if (stats.isDirectory()) {
      node[childDir] = await prepareRoutes(childPath);
      continue;
    }

    // skip any non-js files
    if (!childDir.endsWith('.js') && !childDir.endsWith('.ts')) {
      continue;
    }

    if (childDir.startsWith('[')) {
      node[getDynamicRouteName(childDir)] = {__handler: childPath};
    } else if (childDir.startsWith('index')) {
      node.__handler = childPath;
    } else {
      node[getStaticRouteName(childDir)] = {__handler: childPath};
    }
  }

  return node;
};