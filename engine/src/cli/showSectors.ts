import {run} from './utils/run';
import {portfolioOperations} from '../portfoio/operations';
import {defaultContext} from '../context/context';
import {getPortfolioSectors} from '../evaluation/scoreSector';

run(async () => {
  const sectorMap = getPortfolioSectors(await defaultContext().portfolioStorage.findAll());
  Object.entries(sectorMap)
    .sort((a, b) => a[1] > b[1] ? -1 : 1)
    .forEach((it) => {
        console.log(`${it[0]}: ${it[1]}%`);
      }
    );
});