import {run} from './run';
import {readMfState} from '../magic-formula/storage/mfStorage';
import {indexBy, omit, prop, reverse} from 'ramda';
import {readPortfolio} from '../portfoio/portfolioStorage';
import {FileStorage} from '../storage/file';
import {rankCompanies} from '../evaluation/rankCompanies';
import {calculateScores} from '../evaluation/calculateScores';

const storage = new FileStorage<any>('_persistance_/storage/rankedMagicFormula.json');

run(async () => {
  const [companies, portfolio] = await Promise.all([readMfState(), readPortfolio()]);
  const rankedCompanies = rankCompanies(calculateScores(companies, portfolio));
  const ownedCompanies = indexBy(prop('ticker'), await readPortfolio());

  await storage.write(
    rankedCompanies
      .filter(it => !ownedCompanies[it.ticker])
      .sort((a, b) => a.rank.total > b.rank.total ? -1 : 1)
      .map(it => {
        const result: any = omit(['revenue'], it);
        result.revenueStr = {
          ...it.revenue,
          data: reverse(it.revenue.data).map(it => `${it.valueStr ?? '?'} (${it.date})`).join(' → ')
        };

        return result;
      })
  );
});
