// import {run} from './run';
// import {readPortfolio, øwritePortfolio} from '../enrichment/cache/yahooCache';
// import {FileStorage} from '../storage/file';
// import {readState, writeState} from '../magic-formula/storage/mfStorage';
// import {indexBy, omit, prop} from 'ramda';
// import {CompanyStock, PortfolioCompany} from '../common/companies';
//
// const storage = new FileStorage<any>('_persistance_/storage/yahooData.json');
//
// run(async () => {
//   const portfolio: PortfolioCompany[] = await readPortfolio();
//   const mfState: CompanyStock[] = await readState();
//
//   // const stocksByTicker = indexBy(prop('ticker'), mfState.concat(portfolio));
//   // const rawDataByTicker = Object.entries(stocksByTicker).reduce((acc, [key, value]) => {
//   //   const data = {
//   //     ...value.rawFinancialData.yahoo,
//   //     lastUpdated: new Date().toISOString()
//   //   }
//   //   return Object.assign(acc, {[key]: data});
//   // }, {})
//   //
//   // await storage.write(rawDataByTicker);
//
//   await writePortfolio(portfolio.map(it => omit(['rawFinancialData'], it)));
//   await writeState(mfState.map(it => omit(['rawFinancialData'], it)));
// });