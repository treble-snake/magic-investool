import {readState, writeState} from '../magic-formula/storage/mfStorage';
import {run} from './run';
import {refreshMagicFormulaData} from '../magic-formula/refreshMagicFormulaData';
import {enrichOutdated} from '../enrichement/enrichOutdated';


run(async () => {
  // Refresh MF
  await refreshMagicFormulaData();

  // Refresh MF data
  const state = await readState();
  return writeState(await enrichOutdated(state, 5));
});