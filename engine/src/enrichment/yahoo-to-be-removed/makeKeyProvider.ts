// import {AppContext} from '../../context/context';
// import {identity} from 'ramda';
//
// /** @deprecated */
// export const makeKeyProvider = (context: AppContext) => {
//   let keyPool: string[] | undefined;
//
//   return {
//     async nextKey(): Promise<string> {
//       if (!keyPool) {
//         const yahooApiKeys = await context.userAccountStorage.getYahooKeys();
//         keyPool = yahooApiKeys.filter(identity);
//       }
//
//       if (keyPool.length === 0) {
//         throw new Error('No available key');
//       }
//
//       return keyPool[0];
//     },
//
//     async reportKey(key: string, reason: string): Promise<void> {
//       keyPool = keyPool?.filter(it => it !== key);
//       await context.userAccountStorage.reportYahooKey(key, reason);
//     }
//   }
// }