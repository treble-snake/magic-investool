import {getCompanyData} from './rest-api/getCompanyData';
import {writeFileSync} from 'fs';
import {getInsightData} from './rest-api/getInsightData';

// getCompanyData('AMCX')
  getInsightData('AMCX')
  .then(data => {
    console.warn(data);
    writeFileSync('./reports/state/amc-insight.json', JSON.stringify(data));
  });