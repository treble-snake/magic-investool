import {prepareRoutes} from '../../src/prepareRoutes';
import * as path from 'path';

describe('prepareRoutes', () => {
  it('should do it', async () => {
    const routeMap = await prepareRoutes(path.resolve(__dirname, 'fixtures'));

    expect(routeMap).toEqual({
      api: {
        account: {
          __handler: path.resolve(__dirname, 'fixtures/api/account.js')
        },
        buy: {
          ':ticker': {
            __handler: path.resolve(__dirname, 'fixtures/api/buy/[ticker].ts')
          }
        },
        user: {
          __handler: path.resolve(__dirname, 'fixtures/api/user/index.js'),
          ':id': {
            __handler: path.resolve(__dirname, 'fixtures/api/user/[id].js'),
          },
          avatar: {
            __handler: path.resolve(__dirname, 'fixtures/api/user/avatar.js'),
          },
          nested: {
            __handler: path.resolve(__dirname, 'fixtures/api/user/nested/index.js'),
            ':code': {
              __handler: path.resolve(__dirname, 'fixtures/api/user/nested/[code].js'),
            },
            foo: {
              __handler: path.resolve(__dirname, 'fixtures/api/user/nested/foo.js'),
            }
          }
        }
      }
    })
  });
});