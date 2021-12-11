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
  const state = await context.mfStorage.findAll();
  return context.mfStorage.save(
    // TODO: no need to rank here probably - UI concern
    await rankOperations(context).scoreAndRank(
      // TODO: update info for portfolio for ones we have there as well
      await enrichmentOperations(context).enrichOutdated(state, 10)
    )
  );
});