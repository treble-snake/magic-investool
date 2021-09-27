import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/operations';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {compose, map, omit, pick} from 'ramda';
import {portfolioOperations} from '../portfoio/operations';
import {rankOperations} from '../evaluation/operations';


run(async () => {
  const context = defaultContext();

  // Refresh MF data
  const state = await context.mfStorage.findAll();
  await context.mfStorage.save(
    // state.map(omit(['rawFinancialData']))
    await rankOperations(context).scoreAndRank(state)
  );
  // console.warn(
  //   state.map(pick(['lastUpdated', 'ticker']))
  // );
  // return context.mfStorage.save(
  //   await enrichmentOperations(context).enrichOutdated(state, 5));
});