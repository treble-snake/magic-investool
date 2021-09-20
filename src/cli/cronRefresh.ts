import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/operations';
import {enrichOutdated} from '../enrichment/enrichOutdated';
import {defaultContext} from '../context/context';


run(async () => {
  const context = defaultContext();
  // Refresh MF
  await magicFormulaOperations(context).refresh();

  // Refresh MF data
  const state = await context.mfStorage.findAll();
  return context.mfStorage.save(await enrichOutdated(state, 5));
});