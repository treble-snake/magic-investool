import {request} from 'undici';
import {YAHOO_API_KEY} from './env.config';
const HEADERS = Object.freeze({
  'x-api-key': YAHOO_API_KEY
});

export const askYahoo = async <T> (url: string): Promise<T> => {
  const {statusCode, body} = await request(url, {
    method: 'GET',
    headers: HEADERS
  });

  if (statusCode !== 200) {
    throw new Error(`Status code: ${statusCode}`);
  }

  const data = await body.json();
  if (data.error) {
    throw new Error(`Yahoo error(${data.error.code}): ${data.error.description}`)
  }

  return data;
}