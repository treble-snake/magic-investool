import {request} from 'undici';
import {BASE_YAHOO_URL, YAHOO_API_KEY} from '../../common/config';

const HEADERS = Object.freeze({
  'x-api-key': YAHOO_API_KEY
});

export const askYahoo = async <T>(url: string, prop?: keyof T): Promise<T> => {
  const absoluteUrl = new URL(url, BASE_YAHOO_URL).toString();
  const {statusCode, body} = await request(absoluteUrl, {
    method: 'GET',
    headers: HEADERS
  });

  if (statusCode !== 200) {
    throw new Error(`Status code: ${statusCode}`);
  }

  const data = await body.json();
  const error = data[prop]?.error;
  if (error) {
    throw new Error(`Yahoo error(${error.code}): ${error.description}`);
  }

  return data;
};