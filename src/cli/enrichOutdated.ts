import {run} from './utils/run';
import {readMfState, writeMfState} from '../magic-formula/storage/mfStorage';
import {enrichOutdated} from '../enrichment/enrichOutdated';


run(async () => {
  const state = await readMfState();
  const enriched = await enrichOutdated(state, 5);
  await writeMfState(enriched);
});