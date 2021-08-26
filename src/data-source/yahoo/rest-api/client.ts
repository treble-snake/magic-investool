import {request} from 'undici';
import {YAHOO_API_KEY} from '../env.config';
const HEADERS = Object.freeze({
  'x-api-key': YAHOO_API_KEY
});

export const askYahoo = async (url: string) => {
  const {statusCode, body} = await request(url, {
    method: 'GET',
    headers: HEADERS
  });

  if (statusCode !== 200) {
    throw new Error(`Status code: ${statusCode}`);
  }

  return body.json();
}