import {getCompanyData} from './rest-api/getCompanyData';
import {writeFileSync} from 'fs';
import {getInsightData} from './rest-api/getInsightData';

// getCompanyData('qweqweqwea')
  getInsightData('qweqweqwea')
  .then(data => {
    console.warn(data);
    console.warn(JSON.stringify(data));
    writeFileSync('./reports/state/error.json', JSON.stringify(data));
  });