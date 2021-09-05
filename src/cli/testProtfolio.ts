import {CompanyWithAnalytics} from '../common/companies';
import {readFile, writeFile} from 'fs/promises';
import {logger} from '../common/logging/logger';
import {run} from './run';

const PORTFOLIO_STORAGE = 'reports/state/portfolio.json';

const readState = async (): Promise<CompanyWithAnalytics[]> => {
  try {
    const fd = await readFile(PORTFOLIO_STORAGE);
    return JSON.parse(fd.toString()).companies;
  } catch (e) {
    logger.error('Failed to read state', e);
    return [];
  }
};

const writeState = (companies: CompanyWithAnalytics[]) => {
  return writeFile(PORTFOLIO_STORAGE, JSON.stringify({
    lastUpdate: new Date().toISOString(),
    companies
  }));
};

run(async () => {
  const state = await readState();

  const sectors = state.reduce((acc: any, it) => {
    acc[it.sector] = acc[it.sector] ? acc[it.sector] + 1 : 1;
    return acc;
  }, {});

  console.warn(sectors);
  console.warn('\n');

  Object.keys(sectors).forEach(key => {
    console.log(`${key}: ${Math.round(10000 * sectors[key] / state.length) / 100}%`);
  });
});