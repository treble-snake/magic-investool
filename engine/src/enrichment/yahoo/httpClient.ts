import {request} from 'undici';

export const getYahooClient = (
  apiKeyProvider: () => Promise<string>, baseUrl: string
) =>
  async <T>(url: string, prop?: keyof T): Promise<T> => {
    const absoluteUrl = new URL(url, baseUrl).toString();
    const {statusCode, body} = await request(absoluteUrl, {
      method: 'GET',
      headers: {
        'x-api-key': await apiKeyProvider()
      }
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