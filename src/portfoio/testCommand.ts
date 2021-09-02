import {MagicCompany} from '../common/companies';
import {readFile, writeFile} from 'fs/promises';
import {logger} from '../common/logging/logger';
import {getCompanyData} from '../enrichement/yahoo/methods/getCompanyData';
const PORTFOLIO_STORAGE = 'reports/state/portfolio.json';

export const readState = async (): Promise<MagicCompany[]> => {
  try {
    const fd = await readFile(PORTFOLIO_STORAGE);
    return JSON.parse(fd.toString()).companies;
  } catch (e) {
    logger.error('Failed to read state', e);
    return [];
  }
}

export const writeState = (companies: MagicCompany[]) => {
  return writeFile(PORTFOLIO_STORAGE, JSON.stringify({
    lastUpdate: new Date().toISOString(),
    companies
  }));
}

const run = async () => {
  const state = await readState();

  const sectors = state.reduce((acc: any, it) => {
    acc[it.sector] = acc[it.sector] ? acc[it.sector] + 1 : 1;
    return acc;
  }, {});

  console.warn(sectors);
  console.warn("\n");

  Object.keys(sectors).forEach(key => {
    console.log(`${key}: ${Math.round(10000 * sectors[key] / state.length) / 100}%`);
  });

  // const newState = await Promise.all(
  //   state.map(async (it) => {
  //     const data = await getCompanyData(it.ticker);
  //     const {quoteType, assetProfile} = data;
  //     return {
  //       ...it,
  //       name: quoteType.longName,
  //       industry: assetProfile.industry,
  //       sector: assetProfile.sector,
  //       country: assetProfile.country
  //     }
  //   })
  // );
  //
  // await writeState(newState);
};

run()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });