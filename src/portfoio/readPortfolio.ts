import {CompanyWithAnalytics} from '../common/companies';
import {readFile} from 'fs/promises';
import {logger} from '../common/logging/logger';

export const readPortfolio = async (): Promise<CompanyWithAnalytics[]> => {
  try {
    const fd = await readFile('_persistance_/storage/portfolio.json');
    return JSON.parse(fd.toString()).companies;
  } catch (e) {
    logger.error('Failed to read state', e);
    return [];
  }
}