import {run} from './utils/run';
import {readMfState} from '../magic-formula/storage/mfStorage';
import {indexBy, prop} from 'ramda';
import {readPortfolio} from '../portfoio/portfolioStorage';
import {FileStorage} from '../storage/file';
import {rankCompanies} from '../evaluation/rankCompanies';
import {calculateScores} from '../evaluation/calculateScores';
import {replaceRevenue} from './utils/replaceRevenue';

const storage = new FileStorage<any>('_persistance_/storage/rankedMagicFormula.json');

run(async () => {
  const [companies, portfolio] = await Promise.all([readMfState(), readPortfolio()]);
  const rankedCompanies = rankCompanies(calculateScores(companies, portfolio));
  const ownedCompanies = indexBy(prop('ticker'), await readPortfolio());

  await storage.write(
    rankedCompanies
      .filter(it => !ownedCompanies[it.ticker])
      .sort((a, b) => -a.rank.total + b.rank.total)
      .map(replaceRevenue)
  );
});
