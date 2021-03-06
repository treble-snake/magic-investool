import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';

export type HistoryData = {
  history: Awaited<ReturnType<ReturnType<typeof defaultContext>['historyStorage']['findAll']>>
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HistoryData>
) {
  const history = await defaultContext().historyStorage.findAll();
  res.status(200).json({history});
}
