import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const {userSettingsStorage} = defaultContext();
  const ticker = String(req.query.ticker).trim();
  if (!ticker) {
    return res.status(400).send();
  }

  const isHidden = await userSettingsStorage.isHidden(ticker);
  await isHidden ?
    userSettingsStorage.showTicker(ticker) :
    userSettingsStorage.hideTicker(ticker);

  return res.status(204).send();
}
