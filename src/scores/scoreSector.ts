import {CompanyWithAnalytics} from '../common/companies';
import {countBy, mapObjIndexed} from 'ramda';

export const getPortfolioSectors = (companies: CompanyWithAnalytics[]) => {
  const total = companies.length;
  return mapObjIndexed(
    (x: number) => Math.round(100 * 100 * x / total) / 100,
    countBy((it: CompanyWithAnalytics) => it.sector)(companies)
  );
};

export const scoreSector = (sector: string, sectors: Record<string, number>) => {
  const value = 1 - ((sectors[sector] || 0) / 100);
  return Math.round(100 * 100 * value) / 100;
};