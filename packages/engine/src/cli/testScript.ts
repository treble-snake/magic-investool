import {run} from './utils/run';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {prepareStorage} from './utils/prepareStorage';


run(async () => {
  const context = defaultContext();

  prepareStorage();

  const data =
    await enrichmentOperations(context).enrichCompany({ticker: 'SWBI'}, false);

  console.warn(require('util').inspect(data, false, null));


  // await magicFormulaOperations(context)
  //   .refresh();

  // console.warn(
  //   parseHtml(
  //     await getCompanies(
  //       await login(
  //         MF_AUTH_EMAIL, MF_AUTH_PASSWORD
  //       )
  //     )
  //   )
  // );
});