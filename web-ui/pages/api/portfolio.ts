import type {NextApiRequest, NextApiResponse} from 'next';
import {
  defaultContext,
  PortfolioCompany,
  portfolioOperations
} from '@investool/engine';
import {Unpacked} from '../../libs/types';

export type PortfolioData = {
  companies: PortfolioCompany[],
  sectors: Unpacked<ReturnType<ReturnType<typeof portfolioOperations>['getSectors']>>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PortfolioData>
) {
  const context = defaultContext();
  const sectors = await portfolioOperations(context).getSectors();
  const companies = await context.portfolioStorage.findAll();

  res.status(200).json({
    companies, sectors
  });
}
