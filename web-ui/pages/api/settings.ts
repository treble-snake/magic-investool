import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';

export type SettingsData = {
  hiddenTickers: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsData>
) {
  res.status(200).json({
    hiddenTickers: await defaultContext().userSettingsStorage.getHiddenTickers()
  });
}
