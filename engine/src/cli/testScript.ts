import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/magicFormulaOperations';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {compose, map, omit, pick} from 'ramda';
import {portfolioOperations} from '../portfoio/portfolioOperations';
import {rankOperations} from '../evaluation/rankOperations';


run(async () => {
  const context = defaultContext();


 const data =
   await enrichmentOperations(context).enrichCompany({ticker: 'QDEL'});
 console.warn(data);
});