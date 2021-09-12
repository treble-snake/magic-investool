import {run} from './run';
import {readMfState, writeMfState} from '../magic-formula/storage/mfStorage';
import {readPortfolio} from '../portfoio/portfolioStorage';
import {calculateScores} from '../evaluation/calculateScores';

run(async () => {
  const [companies, portfolio] = await Promise.all([readMfState(), readPortfolio()]);

  await writeMfState(calculateScores(companies, portfolio));
});