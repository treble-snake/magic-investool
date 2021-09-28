import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/operations';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {rankOperations} from '../evaluation/operations';


run(async () => {
  const context = defaultContext();
  // Refresh MF
  await magicFormulaOperations(context).refresh();

  // Refresh MF data
  const state = await context.mfStorage.findAll();
  return context.mfStorage.save(
    await rankOperations(context).scoreAndRank(
      // TODO: update info for portfolio for ones we have there as well
      await enrichmentOperations(context).enrichOutdated(state, 10)
    )
  );
});