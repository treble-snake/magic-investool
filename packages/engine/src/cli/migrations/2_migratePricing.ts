import {run} from '../utils/run';
import {defaultContext} from '../../context/context';
import {getBreakEvenPrice} from '../../portfoio/getBreakEvenPrice';

run(async () => {
  const context = defaultContext();
  const [portfolio, history] = await Promise.all([
    context.portfolioStorage.findAll(),
    context.historyStorage.findAll()
  ]);

  const withBEP = portfolio.map(company => {
    return {
      ...company,
      breakEvenPrice: getBreakEvenPrice(history.filter(rec => rec.ticker === company.ticker))
    };
  });

  await context.portfolioStorage.save(withBEP);
  console.log('Migration complete');
});
