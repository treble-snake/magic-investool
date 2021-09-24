import cookie from 'cookie';
import {AUTH_COOKIE} from '../constants';
import {IncomingHttpHeaders} from 'http';

export const makeHeaders = (token?: string) => {
  const headers: IncomingHttpHeaders = {
    'content-type': 'application/x-www-form-urlencoded'
  };

  if (token) {
    headers['cookie'] = cookie.serialize(AUTH_COOKIE, token);
  }

  return headers;
}