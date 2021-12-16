import moment from 'moment';
import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, rankOperations} from '@investool/engine';
import {mapObjIndexed} from 'ramda';
import {appendFlagHidden} from '../../libs/utils/appendFlagHidden';
import {UiPortfolioCompany} from './portfolio';
import {UiCompanyStock} from './magic-formula';

export type DashboardData = {
  isMagicFormulaEmpty: boolean,
  // These typings are not exactly correct, but help simplifying the code
  suggestions: {
    toBuyMore: (UiPortfolioCompany | UiCompanyStock)[];
    toBuy: (UiPortfolioCompany | UiCompanyStock)[];
    toSell: (UiPortfolioCompany | UiCompanyStock)[];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardData>
) {
  const customDate = req.query.nextMonth === 'true' ?
    moment().add(1, 'month').format('YYYY-MM-DD') :
    undefined;

  const context = defaultContext();
  const [magic, suggestions, hiddenTickers] = await Promise.all([
    context.mfStorage.findAll(),
    rankOperations(context).makeSuggestion({size: 9, customDate}),
    context.userSettingsStorage.getHiddenTickers()
  ]);

  const result = mapObjIndexed(appendFlagHidden(hiddenTickers), suggestions);
  return res.status(200).json({
    isMagicFormulaEmpty: magic.length === 0,
    suggestions: result as DashboardData['suggestions']
  });
};
