import {run} from './run';
import {readState} from '../magic-formula/storage/mfStorage';
import {indexBy, omit, prop, reverse} from 'ramda';
import {readPortfolio} from '../portfoio/portfolioStorage';
import {FileStorage} from '../storage/file';
import {rankCompanies} from '../evaluation/rankCompanies';

const storage = new FileStorage<any>('_persistance_/storage/rankedMagicFormula.json');

run(async () => {
  const rankedCompanies = rankCompanies(await readState());
  const ownedCompanies = indexBy(prop('ticker'), await readPortfolio());

  await storage.write(
    rankedCompanies
      .filter(it => !ownedCompanies[it.ticker])
      .sort((a, b) => a.rank.total > b.rank.total ? -1 : 1)
      .map(it => {
        const result: any = omit(['rawFinancialData', 'revenue'], it);
        result.revenueStr = {
          ...it.revenue,
          data: reverse(it.revenue.data).map(it => `${it.valueStr ?? '?'} (${it.date})`).join(' → ')
        };

        return result;
      })
  );
});
