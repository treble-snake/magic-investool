import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';
import {
  enrichmentOperations
} from '@investool/engine/dist/enrichment/operations';

type Query = {
  ticker: string,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const context = defaultContext();
  const {ticker} = req.query as Query;
  const freshData = await enrichmentOperations(context)
    .enrichCompany({ticker}, true);

  await Promise.all([
    context.portfolioStorage.updateOne(ticker, freshData),
    context.mfStorage.updateOne(ticker, freshData)
  ]);

  res.status(204).json();
}
