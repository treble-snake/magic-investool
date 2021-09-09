import {run} from './run';
import {readPortfolio} from '../portfoio/portfolioStorage';

run(async () => {
  const state = await readPortfolio();

  console.warn(
   state
      .sort((a, b) => a.purchaseDate > b.purchaseDate ? 1 : -1)
      // .map(pick(['name', 'purchaseDate']))
  );
  // const enriched = await enrichOutdated(state, 30);
  // await writePortfolio(newState);
});