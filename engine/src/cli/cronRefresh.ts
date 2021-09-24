import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/operations';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';


run(async () => {
  const context = defaultContext();
  // Refresh MF
  await magicFormulaOperations(context).refresh();

  // Refresh MF data
  const state = await context.mfStorage.findAll();
  return context.mfStorage.save(
    await enrichmentOperations(context).enrichOutdated(state, 5));
});