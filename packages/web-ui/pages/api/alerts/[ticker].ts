import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const ticker = String(req.query.ticker);
  if (req.method === 'PUT') {
    const context = defaultContext();
    const {price} = req.body;
    await context.portfolioStorage.setPriceAlert(ticker, Number(price));
    return res.status(204).send();
  }

  if (req.method === 'DELETE') {
    const context = defaultContext();
    await context.portfolioStorage.removePriceAlert(ticker);
    return res.status(204).send();
  }

  return res.status(405).send();
}
