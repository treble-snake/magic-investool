import moment from 'moment';
import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, rankOperations} from '@investool/engine';
import {Unpacked} from '../../libs/types';

export type SuggestionData = {
  suggestion: Unpacked<ReturnType<ReturnType<typeof rankOperations>['makeSuggestion']>>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestionData>
) {
  const customDate = req.query.nextMonth === 'true' ?
    moment().add(1, 'month').format('YYYY-MM-DD') :
    undefined;

  const suggestion = await rankOperations(defaultContext())
    .makeSuggestion({size: 9, customDate});

  res.status(200).json({
    suggestion
  });
}
