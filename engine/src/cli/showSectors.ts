import {run} from './utils/run';
import {portfolioOperations} from '../portfoio/operations';
import {defaultContext} from '../context/context';

run(async () => {
  Object.entries(portfolioOperations(defaultContext()).getSectors())
    .sort((a, b) => a[1] > b[1] ? -1 : 1)
    .forEach((it) => {
        console.log(`${it[0]}: ${it[1]}%`);
      }
    );
});