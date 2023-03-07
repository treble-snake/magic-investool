import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, magicFormulaOperations} from '@investool/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  await magicFormulaOperations(defaultContext()).refresh();
  res.status(204).send();
}
