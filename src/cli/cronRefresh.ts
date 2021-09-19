import {run} from './utils/run';
import {refreshMagicFormulaData} from '../magic-formula/refreshMagicFormulaData';
import {enrichOutdated} from '../enrichment/enrichOutdated';
import {fileMagicFormulaStorage} from '../magic-formula/storage/FileMagicFormulaStorage';


run(async () => {
  // Refresh MF
  await refreshMagicFormulaData();

  // Refresh MF data
  const storage = fileMagicFormulaStorage();
  const state = await storage.findAll();
  return storage.save(await enrichOutdated(state, 5));
});