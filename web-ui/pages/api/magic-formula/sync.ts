import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, magicFormulaOperations} from '@investool/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const context = defaultContext();
  await magicFormulaOperations(context).refresh();
  res.status(204).send();
}
