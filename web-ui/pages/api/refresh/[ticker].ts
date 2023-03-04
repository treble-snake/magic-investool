import type {NextApiRequest, NextApiResponse} from 'next';
import {
  DataParts,
  defaultContext,
  enrichmentOperations
} from '@investool/engine';

type Query = {
  ticker: string,
  part?: DataParts
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const context = defaultContext();
  const {ticker, part} = req.query as Query;
  const options = part ? {parts: [part]} : {};

  await enrichmentOperations(context)
    .enrichTicker(ticker, true, options);

  res.status(204).json();
}
