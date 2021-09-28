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
  const [portfolio, mgfState] = await Promise.all([
    context.portfolioStorage.findAll(),
    context.mfStorage.findAll()
  ]);

  const {ticker} = req.query;

  const freshData = await enrichmentOperations(context).enrichCompany({
    // TODO: improve interface?
    ticker: req.query.ticker
  } as CoreCompany);

  // no need to rank the portfolio
  await context.portfolioStorage.updateOne(String(ticker), freshData);

  // TODO: updateOne method?
  if (mgfState.some(it => it.ticker === ticker)) {
    await context.mfStorage.save(
      await rankOperations(context).scoreAndRank(
        mgfState.map(it => it.ticker === ticker ? {...it, ...freshData} : it)));
  }

  res.status(200).json({
    ok: 1
  });
}
