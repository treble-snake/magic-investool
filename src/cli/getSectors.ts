import {run} from './run';
import {getPortfolioSectors} from '../evaluation/scoreSector';
import {readPortfolio} from '../portfoio/portfolioStorage';

run(async () => {
  Object.entries(getPortfolioSectors(await readPortfolio()))
    .sort((a, b) => a[1] > b[1] ? -1 : 1)
    .forEach((it) => {
        console.log(`${it[0]}: ${it[1]}%`);
      }
    );
});