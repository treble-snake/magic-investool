import cookie from 'cookie';
import {AUTH_COOKIE} from '../constants';

export const makeHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  if (token) {
    headers['cookie'] = cookie.serialize(AUTH_COOKIE, token);
  }

  return headers;
}