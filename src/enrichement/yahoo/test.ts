import {getCompanyData} from './methods/getCompanyData';
import {writeFileSync} from 'fs';
import {getInsightData} from './methods/getInsightData';
import {logger} from '../../common/logging/logger';

// TODO remove
// getCompanyData('qweqweqwea')
  getInsightData('qweqweqwea')
  .then(data => {
    logger.warn(data);
    logger.warn(JSON.stringify(data));
    writeFileSync('./reports/state/error.json', JSON.stringify(data));
  });