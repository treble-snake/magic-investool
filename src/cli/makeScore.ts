import {run} from './run';
import {readState, writeState} from '../magic-formula/storage/mfStorage';
import {readPortfolio} from '../portfoio/portfolioStorage';
import {calculateScores} from '../scores/calculateScores';

run(async () => {
  const [companies, portfolio] = await Promise.all([readState(), readPortfolio()]);

  await writeState(calculateScores(companies, portfolio));
});