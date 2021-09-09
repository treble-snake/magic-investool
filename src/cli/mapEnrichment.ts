import {readState, writeState} from '../magic-formula/storage/mfStorage';
import {enrichCompanyWith} from '../enrichement/enrichCompany';
import {omit} from 'ramda';
import {inspect} from 'util';
import {run} from './run';
import {CompanyWithAnalytics} from '../common/companies';


run(async () => {
  const state = (await readState()) as CompanyWithAnalytics[];

  const newState = state.map((company) => {
    const enriched = enrichCompanyWith(
      company,
      company.rawFinancialData.yahoo!.basic,
      company.rawFinancialData.yahoo!.insights
    );

    console.warn(inspect(omit(['rawFinancialData'], enriched), false, 3, true));
    return enriched;
  });

  await writeState(newState);
})