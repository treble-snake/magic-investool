import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/magicFormulaOperations';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {rankOperations} from '../evaluation/rankOperations';


run(async () => {
  const context = defaultContext();
  // Refresh MF
  await magicFormulaOperations(context).refresh();

  // Refresh MF data
  const mf = await context.mfStorage.findAll();
  const portfolio = await context.portfolioStorage.findAll();

  const enrichmentOps = enrichmentOperations(context);
  const [mfOldTicker] = enrichmentOps.getOutdatedTickers(mf, 1);
  const [ownOldTicker] = enrichmentOps.getOutdatedTickers(portfolio, 1);

  await enrichmentOps.enrichTicker(mfOldTicker);
  await enrichmentOps.enrichTicker(ownOldTicker);

  // return context.mfStorage.save(
  //   await rankOperations(context).scoreAndRank(
  //     // TODO: update info for portfolio for ones we have there as well
  //     await enrichmentOperations(context).enrichOutdated(state)
  //   )
  // );
});