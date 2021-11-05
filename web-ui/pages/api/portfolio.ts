import type {NextApiRequest, NextApiResponse} from 'next';
import {
  defaultContext,
  PortfolioCompany,
  portfolioOperations
} from '@investool/engine';
import {Hidden, Unpacked} from '../../libs/types';
import {indexBy, map, pipe, prop} from 'ramda';
import {appendFlagHidden} from '../../libs/utils/appendFlagHidden';

export type UiPortfolioCompany = PortfolioCompany & Hidden & {
  hasMagic: boolean;
};

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
  const [magicList, portfolio, hiddenTickers] = await Promise.all([
    context.mfStorage.findAll(),
    context.portfolioStorage.findAll(),
    context.userSettingsStorage.getHiddenTickers()
  ]);
  const magicMap = indexBy(prop('ticker'), magicList);

  const companies = pipe(
    map((it: PortfolioCompany) => ({...it, hasMagic: Boolean(magicMap[it.ticker])})),
    appendFlagHidden(hiddenTickers),
  )(portfolio);

  return res.status(200).json({companies, sectors});
}
