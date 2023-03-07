import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';
import {
  AccountData as EngineAccountData
} from '@investool/engine/dist/user-settings/UserAccountStorage.types';

export type AccountData = EngineAccountData;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountData>
) {
  const {userAccountStorage} = defaultContext();
  if (req.method === 'POST') {
    await userAccountStorage.patchAccountData(req.body);
  }

  return res.status(200).json(await userAccountStorage.getAccountData());
}
