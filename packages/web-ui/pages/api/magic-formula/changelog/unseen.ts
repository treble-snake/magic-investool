import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, magicFormulaOperations} from '@investool/engine';
import {ChangelogItem} from './index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChangelogItem[]>
) {
  const context = defaultContext();
  const unseen = await magicFormulaOperations(context).getUnseenChanges(60);
  res.status(200).json(unseen);
}
