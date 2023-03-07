import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, portfolioOperations} from '@investool/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  await portfolioOperations(defaultContext()).updateAll();
  res.status(204).send();
}
