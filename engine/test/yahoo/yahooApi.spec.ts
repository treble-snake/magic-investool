// import {MockAgent, setGlobalDispatcher} from 'undici';
// import {BASE_YAHOO_URL} from '../../src/common/config';
// import {dummyQuoteSummary} from '../data-source/yahoo-to-be-removed/dummyQuoteSummary';
//
// function setupMocks() {
//   const mockAgent = new MockAgent({connections: 1});
//   mockAgent.disableNetConnect();
//   const mockClient = mockAgent.get(BASE_YAHOO_URL);
//   setGlobalDispatcher(mockAgent);
//
//   mockClient.intercept({
//     path: /finance\/quoteSummary/,
//     method: 'GET',
//     headers: {'x-api-key': 'invalid'}
//   }).reply(401, {message: 'Invalid key'});
//
//   mockClient.intercept({
//     path: /finance\/quoteSummary/,
//     method: 'GET',
//     headers: {'x-api-key': 'expired'}
//   }).reply(401, {message: 'Expired key'});
//
//   mockClient.intercept({
//     path: /finance\/quoteSummary/,
//     method: 'GET',
//     headers: {'x-api-key': 'valid'}
//   }).reply(200, dummyQuoteSummary('BANG'));
// }

describe.skip('Yahoo HTTP client', () => {
  it.skip('nothing', () => {
  });
  // beforeEach(setupMocks);
  //
  // it('should rotate API keys', async () => {
  //   const context = fakeContext(fakeApiKeys(['expired', 'invalid', 'valid']));
  //   const api = yahooApi(context);
  //
  //   const answer = await api.getCompanyData('BANG');
  //   expect(answer.quoteType).toEqual(expect.objectContaining({
  //     symbol: 'BANG', longName: 'BANG Name'
  //   }));
  // });
  //
  // it('should mark API keys as failed', async () => {
  //   const fileStorage = fakeFileStorage({
  //     yahooApiKeys: ['expired', 'valid'].map(value => ({value}))
  //   } as InternalAccountData);
  //
  //   const context =
  //     fakeContext({userAccountStorage: fileUserAccountStorage(fileStorage)});
  //   const api = yahooApi(context);
  //
  //   const answer = await api.getCompanyData('BANG');
  //   expect(answer.quoteType).toEqual(expect.objectContaining({
  //     symbol: 'BANG', longName: 'BANG Name'
  //   }));
  //
  //   const keys = fileStorage.data?.yahooApiKeys;
  //   const expiredKey = keys?.find(it => it.value === 'expired');
  //   const validKey = keys?.find(it => it.value === 'valid');
  //
  //   expect(expiredKey?.lastFailedAt).toBeGreaterThan(0);
  //   expect(expiredKey?.lastFailureReason).toEqual('Status: 401');
  //   expect(validKey?.lastFailedAt).toBeUndefined();
  // });
  //
  // it('should sort keys according to failure time', async () => {
  //   const fileStorage = fakeFileStorage({
  //     yahooApiKeys: ['expired', 'valid'].map(value => ({value}))
  //   } as InternalAccountData);
  //   const context =
  //     fakeContext({userAccountStorage: fileUserAccountStorage(fileStorage)});
  //   await yahooApi(context).getCompanyData('BANG');
  //   const failedAt1 = fileStorage.data?.yahooApiKeys
  //     ?.find(it => it.value === 'expired')?.lastFailedAt;
  //
  //   setupMocks();
  //   await yahooApi(context).getCompanyData('BANG');
  //   const failedAt2 = fileStorage.data?.yahooApiKeys
  //     ?.find(it => it.value === 'expired')?.lastFailedAt;
  //
  //   expect(failedAt1).toBeGreaterThan(0);
  //   expect(failedAt1).toEqual(failedAt2);
  // });
  //
  // it('should fail if no API keys are valid', async () => {
  //   const context = fakeContext(fakeApiKeys(['expired', 'invalid']));
  //   const api = yahooApi(context);
  //
  //   try {
  //     await api.getCompanyData('BANG');
  //   } catch (e) {
  //     return;
  //   }
  //
  //   throw new Error('Key shortage was not detected');
  // });
  //
  // it('should filter out empty API keys', async () => {
  //   const context = fakeContext(fakeApiKeys(['', null, undefined, 'valid'] as any));
  //   const api = yahooApi(context);
  //
  //   const answer = await api.getCompanyData('BANG');
  //   expect(answer.quoteType).toEqual(expect.objectContaining({
  //     symbol: 'BANG', longName: 'BANG Name'
  //   }));
  // });
});

