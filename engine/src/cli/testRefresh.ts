import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/operations';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {compose, map, pick} from 'ramda';
import {portfolioOperations} from '../portfoio/operations';


run(async () => {
  const context = defaultContext();

  console.warn(
    await portfolioOperations(context).getSectors()
  );
  // Refresh MF data
  // const state = await context.mfStorage.findAll();
  // console.warn(
  //   state.map(pick(['lastUpdated', 'ticker']))
  // );
  // return context.mfStorage.save(
  //   await enrichmentOperations(context).enrichOutdated(state, 5));
});