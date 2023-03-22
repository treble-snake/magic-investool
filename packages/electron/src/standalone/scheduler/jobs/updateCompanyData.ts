import {
  defaultContext,
  enrichmentOperations,
  magicFormulaOperations
} from '@investool/engine';

export const updateCompanyData = async () => {
  console.debug('Scheduled company update started');
  const context = defaultContext();

  // Refresh MF
  await magicFormulaOperations(context).refresh();
  console.debug('Magic Formula list refreshed');

  // Refresh MF data
  const [mf, portfolio] = await Promise.all([
    context.mfStorage.findAll(),
    context.portfolioStorage.findAll()
  ]);

  const enrichmentOps = enrichmentOperations(context);
  const [mfOldTicker] = enrichmentOps.getOutdatedTickers(mf, 1);
  const [ownOldTicker] = enrichmentOps.getOutdatedTickers(portfolio, 1);

  // let's do it sequential to avoid potential write conflicts
  await enrichmentOps.enrichTicker(mfOldTicker);
  await enrichmentOps.enrichTicker(ownOldTicker);

  console.debug('Company data refreshed');
};