import {run} from './utils/run';
import {enrichOutdated} from '../enrichment/enrichOutdated';
import {fileMagicFormulaStorage} from '../magic-formula/storage/FileMagicFormulaStorage';


run(async () => {
  const storage = fileMagicFormulaStorage();
  const state = await storage.findAll();
  const enriched = await enrichOutdated(state, 5);
  await storage.save(enriched);
});