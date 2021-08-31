import {logger} from './common/logging/logger';
import {syncMagicFormula} from './magic-formula/syncMagicFormula';


syncMagicFormula()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });