import type {NextApiRequest, NextApiResponse} from 'next';
import {CompanyStock, defaultContext, rankOperations} from '@investool/engine';
import {indexBy, map, pipe, prop} from 'ramda';
import {appendFlagHidden} from '../../../libs/utils/appendFlagHidden';

export type UiCompanyStock = CompanyStock & {
  owned: boolean;
  hidden: boolean;
};
export type MagicData = {
  magic: UiCompanyStock[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MagicData>
) {
  const context = defaultContext();
  const [magic, portfolio, hiddenTickers] = await Promise.all([
    context.mfStorage.findAll(),
    context.portfolioStorage.findAll(),
    context.userSettingsStorage.getHiddenTickers()
  ]);

  const owned = indexBy(prop('ticker'), portfolio);
  const companiesToShow = pipe(
    map((it: CompanyStock) => ({...it, owned: Boolean(owned[it.ticker])})),
    appendFlagHidden(hiddenTickers),
  )(magic);

  return res.status(200).json({
    magic: await rankOperations(context).scoreAndRank(companiesToShow)
  });
}
