import {run} from './utils/run';
import {indexBy, prop} from 'ramda';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';
import {FileStorage} from '../storage/file';
import {rankCompanies} from '../evaluation/rankCompanies';
import {calculateScores} from '../evaluation/calculateScores';
import {replaceRevenue} from './utils/replaceRevenue';
import {fileMagicFormulaStorage} from '../magic-formula/storage/FileMagicFormulaStorage';

const storage = new FileStorage<any>('_persistance_/storage/rankedMagicFormula.json');

run(async () => {
  const mfStorage = fileMagicFormulaStorage();
  const [companies, portfolio] = await Promise.all([
    mfStorage.findAll(),
    filePortfolioStorage().findAll()
  ]);
  const rankedCompanies = rankCompanies(calculateScores(companies, portfolio));
  const ownedCompanies = indexBy(prop('ticker'), portfolio);

  await mfStorage.save(rankedCompanies);
  await storage.write(
    rankedCompanies
      .filter(it => !ownedCompanies[it.ticker])
      .sort((a, b) => -a.rank.total + b.rank.total)
      .map(replaceRevenue)
  );
});
