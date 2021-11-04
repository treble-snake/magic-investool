import type {NextApiRequest, NextApiResponse} from 'next';
import {CompanyStock, defaultContext, rankOperations} from '@investool/engine';
import {indexBy, prop, identity} from 'ramda';

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
  const hidden = indexBy(identity, hiddenTickers);

  res.status(200).json({
    magic: await rankOperations(context).scoreAndRank(magic.map(it => ({
      ...it,
      owned: Boolean(owned[it.ticker]),
      hidden: Boolean(hidden[it.ticker])
    })))
  });
}
