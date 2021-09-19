import {run} from './utils/run';
import {getPortfolioSectors} from '../evaluation/scoreSector';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';

run(async () => {
  Object.entries(getPortfolioSectors(await filePortfolioStorage().findAll()))
    .sort((a, b) => a[1] > b[1] ? -1 : 1)
    .forEach((it) => {
        console.log(`${it[0]}: ${it[1]}%`);
      }
    );
});