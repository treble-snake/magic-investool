import {run} from './run';
import {readState, writeState} from '../magic-formula/storage/mfStorage';
import {enrichOutdated} from '../enrichment/enrichOutdated';


run(async () => {
  const state = await readState();
  const enriched = await enrichOutdated(state as any, 5);
  await writeState(enriched);
});