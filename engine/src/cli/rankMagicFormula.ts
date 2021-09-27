import {run} from './utils/run';
import {indexBy, prop} from 'ramda';
import {JsonFileStorage} from '../storage/file';
import {replaceRevenue} from './utils/replaceRevenue';
import {defaultContext} from '../context/context';
import {rankOperations} from '../evaluation/operations';

const storage = new JsonFileStorage<any>('_persistance_/storage/rankedMagicFormula.json');

run(async () => {
  const context = defaultContext();
  const [companies, portfolio] = await Promise.all([
    context.mfStorage.findAll(),
    context.portfolioStorage.findAll()
  ]);

  const rankedCompanies = await rankOperations(context).scoreAndRank(companies);
  const ownedCompanies = indexBy(prop('ticker'), portfolio);

  await context.mfStorage.save(rankedCompanies);
  await storage.write(
    rankedCompanies
      .filter(it => !ownedCompanies[it.ticker])
      .sort((a, b) => -a.rank.total + b.rank.total)
      .map(replaceRevenue)
  );
});
