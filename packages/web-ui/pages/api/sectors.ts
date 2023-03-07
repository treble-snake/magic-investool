import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, portfolioOperations} from '@investool/engine';

export type SectorsData =
  Awaited<ReturnType<ReturnType<typeof portfolioOperations>['getSectors']>>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SectorsData>
) {
  const sectors = await portfolioOperations(defaultContext()).getSectors();
  res.status(200).json(sectors);
}
