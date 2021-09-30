import type {NextApiRequest, NextApiResponse} from 'next';
import {CompanyStock, defaultContext, rankOperations} from '@investool/engine';
import {indexBy, prop} from 'ramda';

export type MagicCompany = CompanyStock & { owned: boolean };
export type MagicData = {
  magic: MagicCompany[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MagicData>
) {
  const context = defaultContext();
  const [magic, portfolio] = await Promise.all([
    context.mfStorage.findAll(),
    context.portfolioStorage.findAll()
  ]);
  const owned = indexBy(prop('ticker'), portfolio);

  res.status(200).json({
    magic: await rankOperations(context).scoreAndRank(magic.map(it => ({
      ...it,
      owned: Boolean(owned[it.ticker])
    })))
  });
}
