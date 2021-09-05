import {logger} from '../common/logging/logger';
import {readState} from '../magic-formula/storage/state';
import {enrichCompanyWith} from '../enrichement/enrichCompany';
import {omit} from 'ramda';
import {inspect} from 'util';

const run = async () => {
  const state = await readState();


  const newState = state.slice(0, 5).map((company) => {
    // console.warn(omit(['reports'], rawFinancialData.yahoo.insights.instrumentInfo));
    const enriched = enrichCompanyWith(
      company,
      company.rawFinancialData!.yahoo.basic,
      company.rawFinancialData!.yahoo.insights
    );
    console.warn(inspect(omit(['rawFinancialData', 'revenue'], enriched), false, 3, true));
    return enriched;
  });
};

run()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });