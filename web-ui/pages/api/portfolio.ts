import type {NextApiRequest, NextApiResponse} from 'next';
import {
  defaultContext,
  PortfolioCompany,
  portfolioOperations
} from '@investool/engine';
import {Unpacked} from '../../libs/types';
import {indexBy, prop} from 'ramda';

export type UiPortfolioCompany = PortfolioCompany & { hasMagic: boolean };
export type PortfolioData = {
  companies: UiPortfolioCompany[],
  sectors: Unpacked<ReturnType<ReturnType<typeof portfolioOperations>['getSectors']>>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PortfolioData>
) {
  const context = defaultContext();
  const sectors = await portfolioOperations(context).getSectors();
  const [magic, portfolio] = await Promise.all([
    context.mfStorage.findAll(),
    context.portfolioStorage.findAll()
  ]);
  const mgfByTicker = indexBy(prop('ticker'), magic);

  res.status(200).json({
    companies: portfolio.map(it => ({
      ...it,
      hasMagic: Boolean(mgfByTicker[it.ticker])
    })),
    sectors
  });
}
