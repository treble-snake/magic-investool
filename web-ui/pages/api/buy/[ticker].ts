import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, portfolioOperations} from '@investool/engine';

type Body = {
  price: number,
  qty: number,
  date: string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const context = defaultContext();
  const ticker = String(req.query.ticker);
  const {price, qty, date} = req.body as Body;

  await portfolioOperations(context).buy(ticker, qty, price, new Date(date));

  res.status(204).send();
}
