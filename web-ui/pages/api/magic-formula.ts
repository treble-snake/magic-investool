import type {NextApiRequest, NextApiResponse} from 'next';
import {
  CompanyStock,
  defaultContext,
  portfolioOperations
} from '@investool/engine';
import {indexBy, prop} from 'ramda';
import {SectorQty} from '../../../engine/src/portfoio/operations';

export type MagicCompany = CompanyStock & { owned: boolean };
export type MagicData = {
  magic: MagicCompany[],
  sectors: SectorQty[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MagicData>
) {
  const context = defaultContext();
  const [magic, portfolio, sectors] = await Promise.all([
    context.mfStorage.findAll(),
    context.portfolioStorage.findAll(),
    portfolioOperations(context).getSectors()
  ])
  const owned = indexBy(prop('ticker'), portfolio);


  res.status(200).json({
    magic: magic.map(it => ({
      ...it,
      owned: Boolean(owned[it.ticker])
    })),
    sectors
  });
}
