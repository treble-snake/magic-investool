import {request} from 'undici';
import {makeHeaders} from '../makeHeaders';

const GET_COMPANIES_URL = 'https://www.magicformulainvesting.com/Screening/StockScreening';

export const getCompanies = async (token: string) => {
  const {statusCode, body} = await request(GET_COMPANIES_URL, {
    method: 'POST',
    headers: makeHeaders(token),
    body: new URLSearchParams({
      MinimumMarketCap: '50',
      Select30: 'true',
      stocks: 'Get Stocks'
    }).toString()
  });

  if (statusCode !== 200) {
    throw new Error(`Status code: ${statusCode}`);
  }

  return body.text();
};