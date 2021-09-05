import {logger} from '../common/logging/logger';
import {readState, writeState} from '../magic-formula/storage/state';
import {enrichAllMissing} from '../enrichement/enrichAllMissing';

const run = async () => {
  const state = await readState();
  // console.warn(state.length);
  // console.warn(await enrichAllMissing(state));
  // let newState = state;
  //
  // if (ARG_TICKER) {
  //   newState = await enrichInState(ARG_TICKER, newState);
  // } else {
  //   for (const company of state) {
  //     newState = await enrichInState(company.ticker, newState);
  //   }
  // }
  //
  const newState = await enrichAllMissing(state);
  await writeState(newState);
};

run()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });