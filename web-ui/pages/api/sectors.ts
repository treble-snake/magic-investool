// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, portfolioOperations} from '@investool/engine';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const sectors = await portfolioOperations(defaultContext()).getSectors();
  res.status(200).json(sectors);
}
