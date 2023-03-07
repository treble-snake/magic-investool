import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  await defaultContext().userSettingsStorage.clearHiddenTickers();
  res.status(204).send();
}
