import {logger} from '../../common/logging/logger';

export const run = (fn: (...args: any) => Promise<any>) => {
  fn()
    .then(() => process.exit(0))
    .catch((e) => {
      logger.error(e);
      process.exit(1);
    });
};
