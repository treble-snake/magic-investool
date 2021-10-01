import {run} from './utils/run';
import {magicFormulaOperations} from '../magic-formula/operations';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {compose, map, omit, pick} from 'ramda';
import {portfolioOperations} from '../portfoio/operations';
import {rankOperations} from '../evaluation/operations';


run(async () => {
  const context = defaultContext();


 const data =
   await enrichmentOperations(context).enrichCompany({ticker: 'QDEL'});
 console.warn(data);
});