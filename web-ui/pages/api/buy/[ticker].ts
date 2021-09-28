import type {NextApiRequest, NextApiResponse} from 'next';
import {
  CoreCompany,
  defaultContext,
  portfolioOperations,
  rankOperations
} from '@investool/engine';
import {Unpacked} from '../../../libs/types';
import {enrichmentOperations} from '@investool/engine/dist/enrichment/operations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const context = defaultContext();
  const {ticker} = req.query;
  const {price} = req.body;

  console.warn('ticker', ticker, 'price', price);
  await portfolioOperations(context).buy(String(ticker), 666, price);


  res.status(200).json({
    ok: 1
  });
}
