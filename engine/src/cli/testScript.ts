import {run} from './utils/run';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';


run(async () => {
  const context = defaultContext();

  const data =
    await enrichmentOperations(context).enrichCompany({ticker: 'SIGA'}, false);

  console.warn(data);
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