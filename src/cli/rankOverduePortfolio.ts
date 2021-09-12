import {run} from './run';
import {readPortfolio} from '../portfoio/portfolioStorage';
import {findOverdueItems} from '../portfoio/findOverdueItems';
import {omit, pick, reverse} from 'ramda';
import {calculateScores} from '../evaluation/calculateScores';
import {FileStorage} from '../storage/file';
import {rankCompanies} from '../evaluation/rankCompanies';

const storage = new FileStorage<any>('_persistance_/storage/rankedPortfolio.json');

run(async () => {
  const portfolio = await readPortfolio();
  const overdue = rankCompanies(calculateScores(
    findOverdueItems(portfolio, new Date('2021-10-01')),
    portfolio
  ));

  console.warn(
    overdue.map(pick(['ticker', 'name', 'purchaseDate']))
  );
  await storage.write(
    overdue
      .sort((a, b) => a.rank.total - b.rank.total)
      .map(it => {
        const result: any = omit(['revenue'], it);
        result.revenueStr = {
          ...it.revenue,
          data: reverse(it.revenue.data).map(it => `${it.valueStr ?? '?'} (${it.date})`).join(' → ')
        };

        return result;
      })
      // .map(pick(['name', 'rank', 'revenueStr']))
  );
});