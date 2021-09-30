import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, rankOperations} from '@investool/engine';
import {enrichmentOperations} from '@investool/engine/dist/enrichment/operations';

type Query = {
  ticker: string,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const context = defaultContext();
  const {ticker} = req.query as Query;

  const mfState = await context.mfStorage.findAll();
  const freshData = await enrichmentOperations(context)
    .enrichCompany({ticker}, true);

  // no need to rank the portfolio
  await context.portfolioStorage.updateOne(String(ticker), freshData);

  // TODO: updateOne method?
  if (mfState.some(it => it.ticker === ticker)) {
    await context.mfStorage.save(
      await rankOperations(context).scoreAndRank(
        mfState.map(it => it.ticker === ticker ? {...it, ...freshData} : it)));
  }

  res.status(204).json();
}
