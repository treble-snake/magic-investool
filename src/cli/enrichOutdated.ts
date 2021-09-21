import {run} from './utils/run';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';


run(async () => {
  const context = defaultContext();
  const enriched = await enrichmentOperations(context)
    .enrichOutdated(await context.mfStorage.findAll(), 5);
  await context.mfStorage.save(enriched);
});