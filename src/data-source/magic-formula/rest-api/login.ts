import {request} from 'undici';
import cookie from 'cookie';
import {AUTH_COOKIE} from '../constants';
import {makeHeaders} from '../makeHeaders';

const LOGIN_URL = 'https://www.magicformulainvesting.com/Account/Logon';

export const login = async (email: string, password: string) => {
  const {headers, statusCode} = await request(LOGIN_URL, {
    method: 'POST',
    headers: makeHeaders(),
    body: new URLSearchParams({
      Email: email,
      Password: password,
      login: 'Login'
    }).toString()
  });

  if (statusCode >= 400) {
    throw new Error(`Status code: ${statusCode}`);
  }

  if (!headers['set-cookie']) {
    throw new Error('No cookies set');
  }

  const cookies = cookie.parse(headers['set-cookie'] as unknown as string);
  if (!cookies[AUTH_COOKIE]) {
    throw new Error('No auth cookie');
  }

  return cookies[AUTH_COOKIE];
};