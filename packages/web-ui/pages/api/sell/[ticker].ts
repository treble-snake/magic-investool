import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, portfolioOperations} from '@investool/engine';

type Body = {
  price: number,
  date: string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const context = defaultContext();
  const ticker = String(req.query.ticker);
  const {price, date} = req.body as Body;

  await portfolioOperations(context).sell(ticker, price, new Date(date));

  res.status(204).send();
}
