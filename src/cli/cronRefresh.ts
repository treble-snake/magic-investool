import {readMfState, writeMfState} from '../magic-formula/storage/mfStorage';
import {run} from './run';
import {refreshMagicFormulaData} from '../magic-formula/refreshMagicFormulaData';
import {enrichOutdated} from '../enrichment/enrichOutdated';


run(async () => {
  // Refresh MF
  await refreshMagicFormulaData();

  // Refresh MF data
  const state = await readMfState();
  return writeMfState(await enrichOutdated(state, 5));
});