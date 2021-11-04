import moment from 'moment';
import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, rankOperations} from '@investool/engine';
import {identity, indexBy} from 'ramda';
import {appendHidden} from '../../libs/utils/appendHidden';
import {CompanyStock, PortfolioCompany} from '@investool/engine/dist/types';

export type UiSuggestedCompany =
  (CompanyStock | PortfolioCompany)
  & { hidden: boolean; };

type SuggestedItems = {
  toBuyMore: UiSuggestedCompany[];
  toBuy: UiSuggestedCompany[];
  toSell: UiSuggestedCompany[];
}

export type SuggestionData = {
  suggestion: SuggestedItems
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestionData>
) {
  const customDate = req.query.nextMonth === 'true' ?
    moment().add(1, 'month').format('YYYY-MM-DD') :
    undefined;

  const context = defaultContext();
  const [suggestion, hiddenTickers] = await Promise.all([
    rankOperations(context).makeSuggestion({size: 9, customDate}),
    context.userSettingsStorage.getHiddenTickers()
  ]);
  const hidden = indexBy(identity, hiddenTickers);

  res.status(200).json({
    suggestion: {
      toBuyMore: appendHidden(suggestion.toBuyMore, hidden),
      toBuy: appendHidden(suggestion.toBuy, hidden),
      toSell: appendHidden(suggestion.toSell, hidden)
    }
  });
};
